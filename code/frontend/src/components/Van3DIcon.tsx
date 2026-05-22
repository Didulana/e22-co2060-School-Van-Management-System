type Van3DIconProps = {
  className?: string;
  compact?: boolean;
};

export default function Van3DIcon({ className = "", compact = false }: Van3DIconProps) {
  return (
    <div className={`van-3d ${compact ? "van-3d--compact" : ""} ${className}`} aria-hidden="true">
      <div className="van-3d__shadow" />
      <div className="van-3d__body">
        <div className="van-3d__roof" />
        <div className="van-3d__windshield" />
        <div className="van-3d__window van-3d__window--one" />
        <div className="van-3d__window van-3d__window--two" />
        <div className="van-3d__stripe" />
        <div className="van-3d__light" />
        <div className="van-3d__wheel van-3d__wheel--front" />
        <div className="van-3d__wheel van-3d__wheel--rear" />
      </div>
    </div>
  );
}
