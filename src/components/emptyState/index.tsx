import EmptyIcon from "../../assets/EmptyState.svg";
import "./style.css";
interface Iprops {
  title: string;
  subTitle?: string;
  src?: string;
  className?: string;
}
export default function EmptyState({
  title,
  src,
  subTitle,
  className,
}: Iprops) {
  return (
    <div className="state">
      <img src={src || EmptyIcon} alt="React Logo" className={"icon"} />
      <h2 style={{ color: "#727272" }}>{title}</h2>
      <h4 style={{ color: "#727272", marginTop: "0px" }}>{subTitle}</h4>
    </div>
  );
}
