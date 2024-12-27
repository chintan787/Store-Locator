import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import { getSettings } from "../utils";
import {
  APIProvider,
} from '@vis.gl/react-google-maps';

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session?.shop;
  let settings;
  if (shop) {
    settings = await getSettings(shop);
  }
  return { apiKey: process.env.SHOPIFY_API_KEY || "" ,shop, settings };
};

export default function App() {
  const { apiKey, shop ,settings} = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        {/* <Link to="/app/additional">Additional page</Link> */}
        <Link to="/app/provider">MapProvider</Link>
        <Link to="/app/stores">Stores</Link>

        <Link to="/app/settings">Settings</Link>
      </NavMenu>
      <APIProvider apiKey={"AIzaSyAFlPehgw95jQld8kzBrmQ_dELOtFRUk6o"}>
      <Outlet context={{ shop , settings }}  />
      </APIProvider>
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
