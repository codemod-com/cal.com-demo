import TwoFactorAuthPage from "@pages/settings/security/two-factor-auth";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () =>
  await _generateMetadata("two_factor_auth", "add_an_extra_layer_of_security");

export default TwoFactorAuthPage;
