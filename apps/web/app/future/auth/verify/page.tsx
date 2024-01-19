import VerifyEmailPage from "@pages/auth/verify-email";
import { WithLayout } from "app/layoutHOC";

async function getData() {
  const EMAIL_FROM = process.env.EMAIL_FROM;

  return {
    EMAIL_FROM,
  };
}

// @ts-expect-error getData arg
export default WithLayout({ getLayout: null, Page: VerifyEmailPage, getData })<"P">;
