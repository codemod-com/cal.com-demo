import PasswordPage from "@pages/settings/security/password";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () => await _generateMetadata("password", "password_description");

export default PasswordPage;
