import ProfilePage from "@pages/settings/my-account/profile";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () => await _generateMetadata("profile", "profile_description");

export default ProfilePage;
