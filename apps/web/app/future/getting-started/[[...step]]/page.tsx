import Page from "@pages/getting-started/[[...step]]";
import { withAppDir } from "app/AppDirSSRHOC";
import { WithLayout } from "app/layoutHOC";

import { getServerSideProps } from "@lib/getting-started/[[...step]]/getServerSideProps";

export default WithLayout({ getLayout: null, getData: withAppDir(getServerSideProps), Page });
