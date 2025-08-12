//로그인 및 회원가입 페이지 입니다
import Button from "../components/generic/Button";
import { onGoogleLoginClick } from "../utils/google-login/googleAuthUtil";

export default function Signup() {
  return (
    <>
      <div>로그인페이지</div>
      <Button
        variant="generic"
        onClick={() => {
          onGoogleLoginClick();
        }}
      ></Button>
    </>
  );
}
