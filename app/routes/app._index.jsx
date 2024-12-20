import {  useState, useCallback } from "react";
import { json } from "@remix-run/node";
// import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Text,
  Card,
  Button, Banner, 
  BlockStack,
  Box,
  Icon, LegacyCard,
  LegacyStack,
  // Tabs,
  InlineStack, Collapsible,
  Link,
} from "@shopify/polaris";
import '../components/customAppStyle.css';

// import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
// import { GoogleMap, LoadScript } from '@react-google-maps/api';

import {
  ChevronDownIcon, ChevronUpIcon
} from '@shopify/polaris-icons';
import CheckIcon from "../images/CheckIcon";
// import {router} from 'react-dom';
import { useNavigate } from '@remix-run/react';
// const containerStyle = {
//   width: '100%',
//   height: '100vh'
// };

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  console.log("responseJson:::::",responseJson)
  const variantId =
    responseJson.data.productCreate.product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
      mutation shopifyRemixTemplateUpdateVariant($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) {
          productVariant {
            id
            price
            barcode
            createdAt
          }
        }
      }`,
    {
      variables: {
        input: {
          id: variantId,
          price: Math.random() * 100,
        },
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return json({
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantUpdate.productVariant,
  });
};





export default function Index() {

  // const nav = useNavigation();
  // const actionData = useActionData();
  // const submit = useSubmit();
  // const shopify = useAppBridge();
  // const isLoading =
  //   ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  // const productId = actionData?.product?.id.replace(
  //   "gid://shopify/Product/",
  //   "",
  // );



  // const [isMapApiKeySet, setIsMapApiKeySet] = useState(false);
  // const [mapRef, setMapRef] = useState();
  // const [center, setCenter] = useState();
  // const [isMapLoaded, setIsMapLoaded] = useState(false);
  // const [mapType, setMapType] = useState('roadmap');


  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  const navigate = useNavigate();
  return (
    <>
      <Page >
        <BlockStack gap="500">
          <Card padding="600">
            <Text variant="heading2xl" as="h2"> Hi Neha Jethwani,</Text>
            <Text >Welcome to Store Locator</Text>
          </Card>

          <Banner
            title="ATTENTION: To complete the Google Map Setting to get your API"
            // action={{ content: 'Edit address' }}
            tone="warning"
          >
            <Text>
              Creating and owning an API key is essentially required to access Google services evenly.
              REASON: You' ll be supposed to use a shared API key with many other members, which may put you at a risk that leads to an imbalance in your website if there are unexpectedly several users overload at a time.
            </Text>
          </Banner>

          <div style={{ height: '200px' }}>
            <LegacyCard sectioned>
              <LegacyStack vertical>
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Text variant="bodyLg" as="h2" >Setup guide</Text>
                    <Text>Use this personalized guide to get your store up and running.</Text>
                  </Box>
                  <Button
                    onClick={handleToggle}
                    ariaExpanded={open}
                    ariaControls="basic-collapsible"
                    variant="tertiary" >
                    <Icon
                      source={open ? ChevronUpIcon : ChevronDownIcon}
                      tone="base" />
                  </Button>
                </Box>
                <Collapsible
                  open={open}
                  id="basic-collapsible"
                  transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                  expandOnPrint >
                  <Box style={styles.innerCollapsible}>
                    <InlineStack gap="400" >
                      <CheckIcon />
                      <Text variant="bodyLg" as="h4" fontWeight="bold" >Add Map Provider</Text>
                      <Text>
                        The Store Locator App uses 3rd party mapping providers Google Maps and MapBox. Because that Map is on your website, publicly available, and your customer uses it freely, you'll have to your relationship with the mapping provider. It involves creating an account with them and generating an API key or Token linked to your Map and site. <Link url="#">Learn more</Link>
                      </Text>
                      <Button onClick={() => navigate('/app/mapprovider')}>
                        Add Map Provider
                      </Button>
                    </InlineStack>
                  </Box>

                  <Box style={styles.innerCollapsible}>
                    <InlineStack gap="400" >
                      <CheckIcon />
                      <Text variant="bodyLg" as="h4" fontWeight="bold" >You've added a store/location.</Text>
                      <Text>
                      Here you can add as many stores as possible. You have the option of selecting manually and bulk upload. Also, the facility of View, Edit, and Delete is here for your convenience. <Link url="#">Learn more</Link>
                      </Text>
                      <Button onClick={() => navigate('/app/stores')}>
                        Add another store 
                      </Button>
                    </InlineStack>
                  </Box>

                </Collapsible>
              </LegacyStack>
            </LegacyCard>
          </div>
        </BlockStack>
      </Page>



    </>
  );
}


const styles = {
  innerCollapsible: {
    background: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    margin:'14px 0'
  },
  para: {
    padding: '10px 0'
  }
}