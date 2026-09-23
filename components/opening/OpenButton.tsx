type OpenButtonProps = {
  onClick: () => void;
};

export default function OpenButton({ onClick }: OpenButtonProps) {
  return (
    <button type="button" className="open-button" onClick={onClick}>
      <span>Open Invitation</span>
      <span aria-hidden="true">›</span>
    </button>
  );
}
