// 버튼 컴포넌트 입니다.
// 버튼내용,버튼 스타일, 버튼 요소들을 인수로 받음
import { clsx } from "clsx"; // 스타일을 변수화 시켜서 넣을 수 있고 분기도 가능함
import type { CommonVariant, VariantStyleMap } from "../../types";

type ButtonProps = {
  variant: CommonVariant; // 스타일 타입 분기
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, variant, ...props }: ButtonProps) {
  const variantStyle: VariantStyleMap = {
    generic: "", // 일반적인 InputField 스타일
    modifyPage: "", // 다른 InputField가 쓰이는 00페이지
  };
  return (
    <div>
      {/* 버튼의 기본 타입은 button으로 정의 */}
      <button
        type={props.type ?? "button"}
        {...props}
        className={clsx(variantStyle[variant] ?? "")}
      >
        {children}
      </button>
    </div>
  );
}
