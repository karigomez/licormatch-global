import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { LocaleProvider } from "@/lib/locale-context";
import { AuthProvider } from "@/lib/auth-context";
import { BottomNav } from "@/components/BottomNav";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0a0a0c" },
      { title: "LicorMatch — Find your perfect night" },
      { name: "description", content: "Discover bars, book tables and explore nightlife across Colombia, USA, Brazil, Italy and France." },
      { property: "og:title", content: "LicorMatch — Find your perfect night" },
      { property: "og:description", content: "Discover bars, book tables and explore nightlife across Colombia, USA, Brazil, Italy and France." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "LicorMatch — Find your perfect night" },
      { name: "twitter:description", content: "Discover bars, book tables and explore nightlife across Colombia, USA, Brazil, Italy and France." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7157e021-fced-49fb-8a98-9b89b863d6e6/id-preview-1df954f5--496fcd14-df8d-45d6-a8a4-f8f1ee475845.lovable.app-1779149451311.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7157e021-fced-49fb-8a98-9b89b863d6e6/id-preview-1df954f5--496fcd14-df8d-45d6-a8a4-f8f1ee475845.lovable.app-1779149451311.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocaleProvider>
          <div className="min-h-screen mx-auto max-w-md relative pb-28">
            <Outlet />
          </div>
          <BottomNav />
        </LocaleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
