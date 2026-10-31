import FacebookIcon from "../../../../icons/Facebook";
import LinkedinIcon from "../../../../icons/Linkedin";
import MailtoIcon from "../../../../icons/Mailto";
import PinterestIcon from "../../../../icons/Pinterest";
import XIcon from "../../../../icons/X";

const SocialShare = ({ attributes }) => {
  const { socialShare } = attributes;
  const { enabled, facebook, twitter, linkedin, pinterest, mailto, position } = socialShare;

  // Encoded once: a raw address with its own query string (?page_id=5&lang=fr) would
  // otherwise end the share link's parameter at its first "&".
  const url = encodeURIComponent(window.location.href);

  if (!enabled) {
    return null;
  }
  return (
    <div className={`pdfp_social_share pdfp_social_icon_${position}`}>
      {facebook && <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} aria-label="Share on Facebook" target="_blank" rel="noopener noreferrer"><FacebookIcon height="40px" width="40px" /></a>}
      {twitter && <a href={`https://twitter.com/intent/tweet?url=${url}`} aria-label="Share on X" target="_blank" rel="noopener noreferrer"><XIcon height="40px" width="40px" /></a>}
      {linkedin && <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`} aria-label="Share on LinkedIn" target="_blank" rel="noopener noreferrer"><LinkedinIcon height="40px" width="40px" /></a>}
      {pinterest && <a href={`https://pinterest.com/pin/create/button/?url=${url}`} aria-label="Share on Pinterest" target="_blank" rel="noopener noreferrer"><PinterestIcon height="40px" width="40px" /></a>}
      {mailto && <a href={`mailto:?subject=${encodeURIComponent(document.title)}&body=${url}`} aria-label="Share by email" target="_blank" rel="noopener noreferrer"><MailtoIcon height="40px" width="40px" /></a>}
    </div>
  );
};

export default SocialShare;