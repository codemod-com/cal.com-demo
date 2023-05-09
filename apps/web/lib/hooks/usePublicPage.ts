import { usePathname } from "next/navigation";

export default function usePublicPage() {
  // const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = ["/[user]", "/booking", "/cancel", "/reschedule"].find((route) =>
    pathname?.startsWith(route)
  );
  return isPublicPage;
}
