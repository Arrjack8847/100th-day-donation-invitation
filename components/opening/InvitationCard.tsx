import BabyPortrait from "./BabyPortrait";
import InvitationTypography from "./InvitationTypography";

export default function InvitationCard() {
  return (
    <article className="invitation-card" aria-label="100th Day Donation invitation card">
      <div className="card-ornament" aria-hidden="true" />
      <BabyPortrait />
      <InvitationTypography />
    </article>
  );
}
