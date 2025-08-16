export type ButtonTitle = {
  title: string;
  iconSrc?: string;
  onClick?: () => void;
};

export default function MyPageButton(props: ButtonTitle) {
  return (
    <button className="bg-[#F2F2F780] rounded-sm p-2" onClick={props.onClick}>
      <div className="flex flex-row items-center">
        {props.iconSrc ? (
          <img src={props.iconSrc} alt="icon" className="me-4 w-6 h-6" />
        ) : (
          <div className="me-4 w-6 h-6" />
        )}
        <h1 className="text-xl">{props.title}</h1>
      </div>
    </button>
  );
}
