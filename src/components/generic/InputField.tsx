// 사용자 입력을 받는 컴포넌트 입니다.
// input의 기본 요소들을 인수로 받음
import { clsx } from "clsx";
import type { CommonVariant, VariantStyleMap } from "../../types";

type InputFieldProps = {
  variant: CommonVariant; // 스타일 타입 분기
} & React.InputHTMLAttributes<HTMLInputElement>; //  해당 타입 정의로 Input 요소들을 전부 받아줌

export default function InputField({ variant, ...props }: InputFieldProps) {
  const variantStyle: VariantStyleMap = {
    generic: "", // 일반적인 InputField 스타일
  };
  return (
    <div>
      <input {...props} className={clsx(variantStyle[variant] ?? "")} />
    </div>
  );
}
