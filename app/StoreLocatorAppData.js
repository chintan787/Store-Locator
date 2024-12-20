'use strict';

class StoreLocationData {
    constructor(prisma, { tableName } = {}) {
        this.prisma = prisma;
        this.tableName = tableName || 'store_location_app_data';

        if (!this.getStoreLocationAppDataTable()) {
            throw new Error(`PrismaClient does not have a ${this.tableName} table`);
        }

        // Check if the table is ready and log the result
        this.ready = this.getStoreLocationAppDataTable().count().catch((cause) => {
            throw new Error(`Prisma ${this.tableName} table does not exist. Please refer to the documentation for troubleshooting.`);
        });
    }        

    async storeShopifyData(session) {
        await this.ready;
        try {
            const response = await fetch(`https://${session.shop}/admin/api/2024-04/shop.json`, {
                headers: {
                    'X-Shopify-Access-Token': session.accessToken,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch shop details: ${response.status} ${response.statusText}`);
            }
    
            const shopDetails = await response.json();

            // Fetch shop ID using GraphQL API
            const graphqlResponse = await fetch(`https://${session.shop}/admin/api/2024-10/graphql.json`, {
                method: 'POST',
                headers: {
                    'X-Shopify-Access-Token': session.accessToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        {
                            shop {
                                id
                            }
                        }
                    `,
                }),
            });

            if (!graphqlResponse.ok) {
                throw new Error(`Failed to fetch store ID: ${graphqlResponse.status} ${graphqlResponse.statusText}`);
            }

            const graphqlData = await graphqlResponse.json();
            const storeId = graphqlData.data.shop.id;
    
            shopDetails.shop.id = storeId; // Add the store ID to the shop details
            const data = this.formatStoreLocationData(session, shopDetails);

            // Check if the shop already exists
            const existingShop = await this.getStoreLocationAppDataTable().findFirst({
                where: { shop: session.shop },
            });
    
            if (existingShop) {
                // Update existing shop information
                await this.getStoreLocationAppDataTable().update({
                    where: { id: existingShop.id },
                    data: {
                        store_information: data.store_information,
                    },
                });
                console.log('Shopify store information updated successfully.');
            } else {
                // Create a new entry if shop doesn't exist
                await this.getStoreLocationAppDataTable().create({ data });
                console.log('Shopify store information stored successfully.');
            }
        } catch (error) {
            console.error('Error in storeShopifyData:', error.message);
            throw error;
        }
    }

    formatStoreLocationData(session, shopDetails) {
        const { id, name, email, shop_owner, phone, city, address1, province, zip, country_code, country_name } = shopDetails.shop;

        // Extract the numeric part of the store ID
        const storeId = id.split('/').pop(); // Split by '/' and get the last part

        const storeInformation = {
            store_id : storeId,
            name,
            email,
            shop_owner,
            phone,
            city,
            address1,
            province,
            zip,
            country_code,
            country_name,
        };

        const appSettings = {
            iconColor: 'blue',
            radius: 20,
            radiusUnits: 0,
            searchRadiusLabel: 'Search Radius',
            mapSearch: '',
            defaultLocation: '',
            zoom: 8,
            storeListingType: '',
            googleMapStyleId: '',
            mapStyle: 'Standard',
            mapLayout: 'left',
            customIcon: []
        };

        return {
            shop: session.shop,
            app_settings: appSettings, // Pass actual app settings if available
            store_location_details: [], // Correct field name
            store_information: storeInformation, 
        };
    }
    
    getStoreLocationAppDataTable() {
        return this.prisma[this.tableName];
    }
}

export const StoreLocatorAppData = StoreLocationData;
