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

describe('SchoolManagement - Live School Name Autocomplete & Map Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
      if (url.includes('nominatim.openstreetmap.org/search')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                place_id: 101,
                name: 'Dharmaraja College',
                display_name: 'Dharmaraja College, Kandy, Central Province, Sri Lanka',
                lat: '7.2885',
                lon: '80.6472',
                address: {
                  school: 'Dharmaraja College',
                  city: 'Kandy',
                  road: 'Dharmaraja Hill',
                },
              },
            ]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    }));
  });

  it('renders school directory and opens Add School modal with School Name input and map', async () => {
    render(<SchoolManagement />);

    expect(await screen.findByText('Royal College')).toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: /Add New School/i });
    fireEvent.click(addButton);

    // Modal opens
    expect(screen.getByText('Register New School')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type school name/i)).toBeInTheDocument();
    expect(screen.getByText('Location Map')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/6.904200/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/79.859600/i)).toBeInTheDocument();
  });

  it('shows dropdown while typing school name and populates details when school is chosen', async () => {
    render(<SchoolManagement />);

    const addButton = screen.getByRole('button', { name: /Add New School/i });
    fireEvent.click(addButton);

    const nameInput = screen.getByPlaceholderText(/Type school name/i);
    fireEvent.change(nameInput, { target: { value: 'Dharmaraja' } });

    // Autocomplete dropdown appears with suggestion
    expect(await screen.findByText('Dharmaraja College')).toBeInTheDocument();

    // Click on the suggested school
    const schoolOption = screen.getByText('Dharmaraja College');
    fireEvent.click(schoolOption);

    // Form fields are populated
    await waitFor(() => {
      expect((screen.getByPlaceholderText(/Type school name/i) as HTMLInputElement).value).toBe(
        'Dharmaraja College'
      );
      expect(
        (screen.getByPlaceholderText(/e.g. Rajakeeya Mawatha/i) as HTMLInputElement).value
      ).toBe('Dharmaraja Hill');
      expect((screen.getByPlaceholderText(/e.g. Colombo, Kandy/i) as HTMLInputElement).value).toBe(
        'Kandy'
      );
      expect((screen.getByPlaceholderText(/6.904200/i) as HTMLInputElement).value).toBe('7.288500');
      expect((screen.getByPlaceholderText(/79.859600/i) as HTMLInputElement).value).toBe(
        '80.647200'
      );
    });
  });

  it('shows "+ Add [Typed Name]" button in dropdown when custom school name is typed', async () => {
    render(<SchoolManagement />);

    const addButton = screen.getByRole('button', { name: /Add New School/i });
    fireEvent.click(addButton);

    const nameInput = screen.getByPlaceholderText(/Type school name/i);
    fireEvent.change(nameInput, { target: { value: 'My Custom Academy' } });

    // "+ Add 'My Custom Academy'" button is present
    const addCustomBtn = await screen.findByText(/\+ Add “My Custom Academy”/i);
    expect(addCustomBtn).toBeInTheDocument();

    fireEvent.click(addCustomBtn);

    // Dropdown closes, name is preserved
    expect((screen.getByPlaceholderText(/Type school name/i) as HTMLInputElement).value).toBe(
      'My Custom Academy'
    );
  });

  it('allows manual adjustment of latitude and longitude coordinates and submits', async () => {
    render(<SchoolManagement />);

    const addButton = screen.getByRole('button', { name: /Add New School/i });
    fireEvent.click(addButton);

    const nameInput = screen.getByPlaceholderText(/Type school name/i);
    const addressInput = screen.getByPlaceholderText(/e.g. Rajakeeya Mawatha/i);
    const cityInput = screen.getByPlaceholderText(/e.g. Colombo, Kandy/i);
    const latInput = screen.getByPlaceholderText('6.904200');
    const lngInput = screen.getByPlaceholderText('79.859600');

    fireEvent.change(nameInput, { target: { value: 'Visakha Vidyalaya' } });
    fireEvent.change(addressInput, { target: { value: 'Vajira Road' } });
    fireEvent.change(cityInput, { target: { value: 'Colombo 04' } });
    fireEvent.change(latInput, { target: { value: '6.889900' } });
    fireEvent.change(lngInput, { target: { value: '79.860100' } });

    const submitBtn = screen.getByRole('button', { name: /Save School/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(adminService.createSchool).toHaveBeenCalledWith({
        name: 'Visakha Vidyalaya',
        address: 'Vajira Road',
        city: 'Colombo 04',
        latitude: 6.8899,
        longitude: 79.8601,
      });
    });
  });
});
