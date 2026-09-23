import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SchoolManagement from './SchoolManagement';
import * as adminService from '../../services/adminService';

// Mock Leaflet because JSDOM doesn't support full SVG/Canvas map rendering
vi.mock('leaflet', () => {
  const mockLayerGroup = {
    addTo: vi.fn().mockReturnThis(),
    clearLayers: vi.fn(),
    addLayer: vi.fn(),
  };

  const mockMarker = {
    addTo: vi.fn().mockReturnThis(),
    on: vi.fn(),
    setLatLng: vi.fn(),
    bindTooltip: vi.fn(),
  };

  const mockMap = {
    setView: vi.fn().mockReturnThis(),
    invalidateSize: vi.fn(),
    remove: vi.fn(),
    panTo: vi.fn(),
    on: vi.fn(),
    getBounds: vi.fn(() => ({
      getSouth: () => 6.9,
      getNorth: () => 7.0,
      getWest: () => 79.8,
      getEast: () => 79.9,
    })),
  };

  return {
    default: {
      map: vi.fn(() => mockMap),
      tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
      marker: vi.fn(() => mockMarker),
      layerGroup: vi.fn(() => mockLayerGroup),
      DivIcon: vi.fn(),
      Icon: {
        Default: {
          prototype: {},
          mergeOptions: vi.fn(),
        },
      },
    },
  };
});

// Mock adminService
vi.mock('../../services/adminService', () => ({
  getSchools: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: 'Royal College',
      city: 'Colombo',
      address: 'Rajakeeya Mawatha',
      latitude: 6.9042,
      longitude: 79.8596,
    },
  ]),
  createSchool: vi.fn().mockResolvedValue({ id: 2, name: 'Ananda College' }),
  deleteSchool: vi.fn().mockResolvedValue({ success: true }),
}));

describe('SchoolManagement - Map-assisted Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders school directory and opens Add School modal with map picker', async () => {
    render(<SchoolManagement />);

    expect(await screen.findByText('Royal College')).toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: /Add New School/i });
    fireEvent.click(addButton);

    // Modal opens
    expect(screen.getByText('Register New School')).toBeInTheDocument();
    expect(screen.getByText('Map & School Listing')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search school name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/6.904200/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/79.859600/i)).toBeInTheDocument();
  });

  it('allows manual adjustment of latitude and longitude coordinates', async () => {
    render(<SchoolManagement />);

    const addButton = screen.getByRole('button', { name: /Add New School/i });
    fireEvent.click(addButton);

    const latInput = screen.getByPlaceholderText('6.904200') as HTMLInputElement;
    const lngInput = screen.getByPlaceholderText('79.859600') as HTMLInputElement;

    // Manually type adjusted coordinates
    fireEvent.change(latInput, { target: { value: '7.290600' } });
    fireEvent.change(lngInput, { target: { value: '80.633700' } });

    await waitFor(() => {
      expect(latInput.value).toBe('7.290600');
      expect(lngInput.value).toBe('80.633700');
    });
  });

  it('submits school creation with manually adjusted or auto-populated coordinates', async () => {
    render(<SchoolManagement />);

    const addButton = screen.getByRole('button', { name: /Add New School/i });
    fireEvent.click(addButton);

    const nameInput = screen.getByPlaceholderText('e.g. Royal College Colombo');
    const addressInput = screen.getByPlaceholderText('e.g. Rajakeeya Mawatha, Colombo 07');
    const cityInput = screen.getByPlaceholderText('e.g. Colombo, Kandy, Gampaha');
    const latInput = screen.getByPlaceholderText('6.904200');
    const lngInput = screen.getByPlaceholderText('79.859600');

    fireEvent.change(nameInput, { target: { value: 'Ananda College' } });
    fireEvent.change(addressInput, { target: { value: 'Maradana Road' } });
    fireEvent.change(cityInput, { target: { value: 'Colombo' } });
    fireEvent.change(latInput, { target: { value: '6.921800' } });
    fireEvent.change(lngInput, { target: { value: '79.870200' } });

    const submitBtn = screen.getByRole('button', { name: /Save School/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(adminService.createSchool).toHaveBeenCalledWith({
        name: 'Ananda College',
        address: 'Maradana Road',
        city: 'Colombo',
        latitude: 6.9218,
        longitude: 79.8702,
      });
    });
  });
});
