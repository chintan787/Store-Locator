import { useEffect, useState, useCallback } from "react";
import {
    Page,
    Text,
    Card,
    Button,
    Select,
    Box,
    Grid,
    TextField, IndexTable, Layout, ChoiceList, useIndexResourceState, IndexFilters,
    Icon, FormLayout, LegacyCard,
    Tabs,
    DropZone, Thumbnail, LegacyStack, Banner, List,
    InlineError, Frame, Modal, Divider, DescriptionList, Link,
    InlineStack,
    BlockStack
} from "@shopify/polaris";
import '../components/customAppStyle.css'
import Papa from "papaparse";
import {
    ImportIcon, ExportIcon, ViewIcon, NoteIcon, LocationFilledIcon, DeleteIcon, EditIcon, FileFilledIcon
} from '@shopify/polaris-icons';

import {
    CitySelect,
    CountrySelect,
    StateSelect,
    LanguageSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { useOutletContext } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import { addStore, deleteStore, getStores, updateStoreDetails } from "../utils";
import { useFetcher, useLoaderData } from '@remix-run/react';
import { authenticate } from "../shopify.server";
import CustomMapProvider from "../components/CustomMapProvider/CustomMapProvider";
import { Modal as AppBridgeModal } from '@shopify/app-bridge-react';

export const loader = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    console.log('session', session);
    const shop = session?.shop;
    let stores;
    if (shop) {
        stores = await getStores(shop);
    }
    return { stores };
};

export async function action({ request }) {
    try {
        const formData = await request.formData();
        const shop = formData.get("shop");
        const action = formData.get("action");

        if (action === "add") {
            const addstoreDetails = formData.get("storeDetails");
            if (shop && addstoreDetails) {
                const isUpdated = await addStore({ shop, addstoreDetails });
                return { success: true, isUpdated, action };
            }
        }
        else if (action === "delete") {
            console.log('delete call');
            const id = formData.get("id");
            console.log('delete', id);
            const res = await deleteStore({ shop, id });
            console.log('res', res);
            return { success: true, action };
        }
        else {
            console.log('edit call');
            const updatedstoreDetails = formData.get("storeDetails");
            const check = await updateStoreDetails({ shop, updatedstoreDetails });
            console.log('check', check);
            return { success: true, action };

        }

        return { success: false, message: "Failed to save data" }; // Example response
    } catch (error) {
        console.error("Error in action:", error);
        return { success: false, message: "Failed to save data" }; // Return an error response
    }
}

export default function StorePage() {
    const { stores } = useLoaderData();
    const { shop, settings } = useOutletContext();
    const fetcher = useFetcher();


    const [errorMessages, setErrorMessages] = useState({});
    const [storeData, setStoreData] = useState();
    const [filterData, setStoreFilterData] = useState();
    const [shopName, setShopName] = useState();
    const sortOptions = [
        { label: "Store", value: "store asc", directionLabel: "Ascending" },
        { label: "Store", value: "store desc", directionLabel: "Descending" },
        // { label: "Status", value: "status active", directionLabel: "Active" },
        // { label: "Status", value: "status draft", directionLabel: "Draft" },
        { label: "City", value: "city asc", directionLabel: "A-Z" },
        { label: "City", value: "city desc", directionLabel: "Z-A" },
        { label: "Country", value: "country asc", directionLabel: "A-Z" },
        { label: "Country", value: "country desc", directionLabel: "Z-A" },
    ];
    const [sortSelected, setSortSelected] = useState(["store asc"]);
    const [phonecode, setPhoneCode] = useState();
    const [currentStorePosition, setCurrentStorePosition] = useState();
    // const { mode, setMode } = useSetIndexFiltersMode('DEFAULT');

    // new store
    // console.log('mode', mode);
    const tabsForStore = [
        {
            id: 'basic-details',
            content: 'Basic Details',
            accessibilityLabel: 'Basic Details',
            panelID: 'basic-details',
        },
        {
            id: 'preview',
            content: 'Preview',
            accessibilityLabel: 'Preview',
            panelID: 'preview',
        },
    ]

    const countryoptions = [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 days', value: 'lastWeek' },
    ];


    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const [itemStrings, setItemStrings] = useState([
        "All",
        "Active",
        "Draft",
        // "Archived",
    ]);
    const [selected, setSelected] = useState(0);
    const [isShowStoreDetails, setIsShowStoreDetails] = useState(false);
    const [selectCountry, setSelectCountry] = useState();
    const [selectState, setSelectState] = useState();
    const [currentTab, setCurrentTab] = useState(0);
    const [isclickCoordinates, setISClickCoordinates] = useState(false)
    const [files, setFiles] = useState();
    const [storeImage, setStoreImage] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [isviewDetails, setIsViewDetails] = useState(false);
    // const [storeImage, setStoreImage] = useState();

    const [rejectedFiles, setRejectedFiles] = useState([]);
    const [storeDetails, setstoreDetails] = useState();
    const [tone, setStatus] = useState(undefined);
    const [type, setType] = useState(undefined);
    const [queryValue, setQueryValue] = useState("");
    const [countryid, setCountryid] = useState(0);
    const [stateid, setstateid] = useState(0);

    const [activeModal, setActiveModal] = useState(false);
    const [csvFile, setCSVFile] = useState();
    const [readFile, setReadFile] = useState();
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [mapApiKey, setMapApiKey] = useState('');

    const resourceName = {
        singular: "store",
        plural: "stores",
    };
    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
    ];


    useEffect(() => {
        if (stores?.length > 1) {
            setStoreData(stores);
            setStoreFilterData(stores);
        }
    }, [stores])

    useEffect(() => {
        if (settings?.googlemapapikey) {
            setMapApiKey(settings?.googlemapapikey);
        }
    }, [settings])


    const handleAllValues = async () => {
        console.log("store", storeDetails);
        const formData = new FormData();
        formData.append("shop", shop); // Corrected this line
        formData.append("action", "add");
        formData.append("storeDetails", JSON.stringify(storeDetails)); // Corrected this line
        fetcher.submit(formData, { method: "post", action: "/app/stores" });
    }

    const handleDeleteStoreDetails = (id) => {
        console.log('id', id);
        const formData = new FormData();
        formData.append("shop", shop);
        formData.append("action", "delete");
        formData.append("id", id);
        fetcher.submit(formData, { method: "post", action: "/app/stores" });
    }
    const handleUpdateStoreDetails = () => {
        console.log('storeDetails update call!', storeDetails);
        const formData = new FormData();
        formData.append("shop", shop); // Corrected this line
        formData.append("action", "edit");
        formData.append("storeDetails", JSON.stringify(storeDetails));
        fetcher.submit(formData, { method: "post", action: "/app/stores" });

    }
    useEffect(() => {
        console.log('fetch', fetcher);
        if (fetcher?.state === "idle" && fetcher?.data?.action === "add") {
            if (fetcher?.data?.success) {
                console.log('fetcher if call');
                setCurrentTab(0);
                setstoreDetails(null);
                setIsShowStoreDetails(false); // Hide the store details
            } else {
                console.error("API call failed:", fetcher?.data?.message);
            }
        }

        if (fetcher?.state === "idle" && fetcher?.data?.action === "edit") {
            if (fetcher?.data?.success) {
                setIsShowStoreDetails(false);
                setCurrentTab(0);
                setIsEdit(!isEdit);
                setstoreDetails(null);
                setIsShowStoreDetails(false); // Hide the store details
            } else {
                console.error("API call failed:", fetcher?.data?.message);
            }
        }
    }, [fetcher?.state, fetcher?.data]);



    const handleStoreSelectChange = useCallback(
        (value) => selectCountry(value),
        [],
    );

    function disambiguateLabel(key, value) {
        switch (key) {
            case "type":
                return value?.map((val) => `type: ${val}`).join(", ");
            case "tone":
                return value?.map((val) => `tone: ${val}`).join(", ");
            default:
                return value;
        }
    }
    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        } else {
            return value === "" || value == null;
        }
    }

    // const deleteView = (index) => {
    //     const newItemStrings = [...itemStrings];
    //     newItemStrings.splice(index, 1);
    //     setItemStrings(newItemStrings);
    //     setSelected(0);
    // };
    // const duplicateView = async (name) => {
    //     setItemStrings([...itemStrings, name]);
    //     setSelected(itemStrings.length);
    //     await sleep(1);
    //     return true;
    // };

    const handleFilter = (index) => {
        console.log('index', index);
        const tempValue = [...storeData];
        const temp = [...storeData]
        if (index === 1) {
            const filteredDataResponse = [...tempValue]?.filter((item) => item.status === 'active');
            // setStoreData(filteredDataResponse)
            setStoreFilterData(filteredDataResponse)
        }
        else if (index === 2) {
            const filteredDataResponse = [...tempValue]?.filter((item) => item.status === 'draft');
            // setStoreData(filteredDataResponse);
            setStoreFilterData(filteredDataResponse);


        }
        else {
            // filteredDataResponse = [...storeData]?.filter((item) => item.status === 'draft');
            // setStoreData(tempValue);
            setStoreFilterData(tempValue);

        }
    }
    const tabs = itemStrings.map((item, index) => ({
        content: item,
        index,
        onAction: () => handleFilter(index),

        // onAction: () => {console.log('tab click') },
        id: `${item}-${index}`,
        isLocked: index === 0,
        // actions:
        // index === 0
        //     ? []
        // : [
        //     {
        //         type: "rename",
        //         onAction: () => { },
        //         onPrimaryAction: async (value) => {
        //             const newItemsStrings = tabs.map((item, idx) => {
        //                 if (idx === index) {
        //                     return value;
        //                 }
        //                 return item.content;
        //             });
        //             await sleep(1);
        //             setItemStrings(newItemsStrings);
        //             return true;
        //         },
        //     },
        //     {
        //         type: "duplicate",
        //         onPrimaryAction: async (name) => {
        //             await sleep(1);
        //             // duplicateView(name);
        //             return true;
        //         },
        //     },
        //     {
        //         type: "edit",
        //     },
        //     {
        //         type: "delete",
        //         onPrimaryAction: async () => {
        //             await sleep(1);
        //             // deleteView(index);/
        //             return true;
        //         },
        //     },
        // ],
    }));
    const onCreateNewView = async (value) => {
        await sleep(500);
        setItemStrings([...itemStrings, value]);
        setSelected(itemStrings.length);
        return true;
    };
    const onHandleCancel = () => { };
    const onHandleSave = async () => {
        console.log('tab click onhandlesave function')
        await sleep(1);
        return true;
    };
    // const primaryAction =
    //     selected === 0
    //         ? {
    //             type: "save-as",
    //             onAction: onCreateNewView,
    //             disabled: false,
    //             loading: false,
    //         }
    //         : {
    //             type: "save",
    //             onAction: onHandleSave,
    //             disabled: false,
    //             loading: false,
    //         };



    const handleStatusChange = useCallback((value) => setStatus(value), []);
    const handleTypeChange = useCallback((value) => setType(value), []);
    // const handleFiltersQueryChange = useCallback(
    //     (value) => { setQueryValue(value); console.log('value', value) }
    // [sortSelected]);

    const handleFiltersQueryChange = useCallback((value) => {

        setQueryValue(value); console.log('value', value);
    }, []);



    const handleSorting = (val) => {
        console.log('store', storeData, val)
        setSortSelected(val);
        let filteredDataResponse;
        switch (val[0]) {
            case 'store asc':
                filteredDataResponse = [...storeData]?.sort((a, b) => {
                    if (a.store_name < b.store_name) return -1;
                    if (a.store_name > b.store_name) return 1;
                    return 0;
                });
                break;
            case 'store desc':
                filteredDataResponse = [...storeData]?.sort((a, b) => {
                    if (a.store_name < b.store_name) return 1;
                    if (a.store_name > b.store_name) return -1;
                    return 0;
                });
                break;
            case 'city asc':
                filteredDataResponse = [...storeData]?.sort((a, b) => {
                    if (a.city < b.city) return -1;
                    if (a.city > b.city) return 1;
                    return 0;
                });
                break;
            case 'city desc':
                filteredDataResponse = [...storeData]?.sort((a, b) => {
                    if (a.city < b.city) return 1;
                    if (a.city > b.city) return -1;
                    return 0;
                });
                break;
            case 'country asc':
                filteredDataResponse = [...storeData]?.sort((a, b) => {
                    if (a.country < b.country) return -1;
                    if (a.country > b.country) return 1;
                    return 0;
                });
                break;
            case 'country desc':
                filteredDataResponse = [...storeData]?.sort((a, b) => {
                    if (a.country < b.country) return 1;
                    if (a.country > b.country) return -1;
                    return 0;
                });
                break;
            default:
                filteredDataResponse = storeData;
                break;
        }
        // setStoreData(filteredDataResponse);
        setStoreFilterData(filteredDataResponse)
    }


    const handleStatusRemove = useCallback(() => setStatus(undefined), []);
    const handleTypeRemove = useCallback(() => setType(undefined), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
    const handleFiltersClearAll = useCallback(() => {
        handleStatusRemove();
        handleTypeRemove();
        handleQueryValueRemove();
    }, [handleStatusRemove, handleQueryValueRemove, handleTypeRemove]);
    const filters = [
        {
            key: "tone",
            label: "Status",
            filter: (
                <ChoiceList
                    title="tone"
                    titleHidden
                    choices={[
                        { label: "Active", value: "active" },
                        { label: "Draft", value: "draft" },
                        { label: "Archived", value: "archived" },
                    ]}
                    selected={tone || []}
                    onChange={handleStatusChange}
                    allowMultiple
                />
            ),
            shortcut: true,
        },
        // {
        //     key: "type",
        //     label: "Type",
        //     filter: (
        //         <ChoiceList
        //             title="Type"
        //             titleHidden
        //             choices={[
        //                 { label: "Brew Gear", value: "brew-gear" },
        //                 { label: "Brew Merch", value: "brew-merch" },
        //             ]}
        //             selected={type || []}
        //             onChange={handleTypeChange}
        //             allowMultiple
        //         />
        //     ),
        //     shortcut: true,
        // },
    ];
    const appliedFilters = [];

    if (tone && !isEmpty(tone)) {
        const key = "tone";
        appliedFilters.push({
            key,
            label: tone,

            // label: disambiguateLabel(key,tone),
            onRemove: handleStatusRemove,
        });
    }
    if (type && !isEmpty(type)) {
        const key = "type";
        appliedFilters.push({
            key,
            label: type,
            onRemove: handleTypeRemove,
        });
    }
    // useEffect(()=>{
    //     if(appliedFilters.length > 0)
    //     console.log('appliedFilters',appliedFilters)
    // },[appliedFilters])
    const handleAddNewStore = () => {
        setIsShowStoreDetails(true);
    }


    const handleEditStoreDetails = (id) => {
        const res = storeData?.filter((item) => item.id === id);
        setstoreDetails(res[0]);
        setIsEdit(!isEdit)
        setTimeout(() => {
            setIsShowStoreDetails(true);
        }, 500)
    }
    const handleViewStoreDetails = (id) => {
        const res = storeData.filter((item) => item.id === id);
        setstoreDetails(res[0]);
        setTimeout(() => {
            setIsViewDetails(!isviewDetails);
        }, 500)

    }

    const handlecloseModal = () => {
        setIsViewDetails(!isviewDetails);

    }

    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(storeData);

    // const rowMarkup = storeData?.map(
    const rowMarkup = filterData?.map(

        (
            { id, store_name, country, state, city, zipcode, status },
            index
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                // selected={selectedResources.includes(id)}
                // onClick={() => { }}
                position={index}
            // selected='indeterminate'
            >
                <IndexTable.Cell>{store_name}</IndexTable.Cell>
                <IndexTable.Cell>{country}</IndexTable.Cell>
                <IndexTable.Cell>{state}</IndexTable.Cell>
                <IndexTable.Cell>{city}</IndexTable.Cell>
                <IndexTable.Cell>{zipcode}</IndexTable.Cell>
                <IndexTable.Cell>{status}</IndexTable.Cell>
                <IndexTable.Cell>
                    <Button variant="plain" onClick={() => handleViewStoreDetails(id)}>
                        <Icon source={ViewIcon} tone="base" />
                    </Button>
                </IndexTable.Cell>
                <IndexTable.Cell  >
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                        <Button variant="plain" onClick={() => handleDeleteStoreDetails(id)}>
                            < Icon source={DeleteIcon} tone="base" />
                        </Button>
                        <Button variant="plain" onClick={() => handleEditStoreDetails(id)}>
                            < Icon source={EditIcon} tone="base" />
                        </Button>
                    </div>

                </IndexTable.Cell>

            </IndexTable.Row>
        )
    );



    const handleStoreTabChange = useCallback(
        (selectedTabIndex) => setCurrentTab(selectedTabIndex),
        [],
    );


    //drop zone
    const hasError = rejectedFiles.length > 0;
    const handleDrop = useCallback(
        (_droppedFiles, acceptedFiles, rejectedFiles) => {
            setFiles(acceptedFiles[0]);
            console.log('storeDetails from drop', storeDetails)
            // setstoreDetails({ ...storeDetails, [id]: e })
            // setstoreDetails({ ...storeDetails, store_marker_icon: acceptedFiles[0] })
        },
        [],
    );

    useEffect(() => {
        setstoreDetails({ ...storeDetails, store_marker_icon: files, store_image: storeImage })
    }, [files, storeImage])
    const handleDropStoreImage = useCallback(
        (_droppedFiles, acceptedFiles, rejectedFiles) => {
            setStoreImage(acceptedFiles[0]);
            // setstoreDetails({ ...storeDetails, store_image: acceptedFiles[0] })
            // setstoreDetails({ ...storeDetails, [id]: e })

            // setFiles((files) => [...files, ...acceptedFiles]);
            // setRejectedFiles(rejectedFiles);
        },
        [],
    );



    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    const StoreImageUpload = !storeImage && <DropZone.FileUpload />;
    const uploadedStoreImage = storeImage && (
        <LegacyStack>
            <Thumbnail
                size="small"
                alt={storeImage.name}
                source={
                    validImageTypes.includes(storeImage.type)
                        ? window.URL.createObjectURL(storeImage)
                        : NoteIcon
                }
            />
        </LegacyStack>
    );

    const StoreMarkerIconUpload = !files && <DropZone.FileUpload />;
    const uploadedStoreMarkerIcon = files && (
        <LegacyStack>
            <Thumbnail
                size="small"
                alt={files.name}
                source={
                    validImageTypes.includes(files.type)
                        ? window.URL.createObjectURL(files)
                        : NoteIcon
                }
            />
        </LegacyStack>
    );


    const errorMessage = hasError && (
        <Banner title="The following images couldn’t be uploaded:" tone="critical">
            <List type="bullet">
                {rejectedFiles.map((file, index) => (
                    <List.Item key={index}>
                        {`"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
                    </List.Item>
                ))}
            </List>
        </Banner>
    );


    const handleStoreValues = (e, id) => {
        // if (id === " status") {
        //     setstoreDetails({ ...storeDetails, [id]: e });
        // }
        // else {

        if (id === "phone_number") {
            setstoreDetails({ ...storeDetails, [id]: e });
        }
        else {
            setstoreDetails({ ...storeDetails, [id]: e });
        }

        // }

        if (e.trim() !== '') {
            setErrorMessages((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[id];
                return newErrors;
            });
        }
    }

    useEffect(() => {
        if (isShowStoreDetails === false) {
            // getStoreList();
        }
    }, [isShowStoreDetails]);


    const validateFields = () => {
        const errors = {};

        // Define required fields with basic presence validation
        const requiredFields = {
            store_name: 'Store name is required',
            store_address: 'Store address is required',
            country: 'Country is required',
            state: 'State is required',
            city: 'City is required',
            zipcode: 'Zipcode is required',
            phone_number: 'Phone number is required',
            email: 'Email is required'
        };

        // Phone and email regex patterns
        const phonePattern = /^[0-9]{10}$/;
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

        // Iterate over each required field to validate presence and specific formats
        for (const [field, errorMessage] of Object.entries(requiredFields)) {
            const value = storeDetails[field];

            if (!value) {
                errors[field] = errorMessage;
            } else if (field === 'phone_number' && !phonePattern.test(value)) {
                errors.phone_number = 'Please enter a valid 10-digit phone number.';
            } else if (field === 'email' && !emailPattern.test(value)) {
                errors.email = 'Please enter a valid email address.';
            }
        }
        setErrorMessages(errors);
        return Object.keys(errors).length === 0;
    };

    const getStoreDetails = () => {
        if (validateFields()) {
            setstoreDetails({ ...storeDetails, status: storeDetails?.status ? storeDetails?.status : 'active' })
            setCurrentTab(1);
        }
    };

    // const bulkActions = [
    //     {
    //         content: 'Add tags',
    //         onAction: () => console.log('Todo: implement bulk add tags'),
    //     },
    //     {
    //         content: 'Remove tags',
    //         onAction: () => console.log('Todo: implement bulk remove tags'),
    //     },
    //     {
    //         icon: DeleteIcon,
    //         destructive: true,
    //         content: 'Delete orders',
    //         onAction: () => console.log('Todo: implement bulk delete'),
    //     },
    // ];


    const toggleActive = useCallback(() => setActiveModal((activeModal) => !activeModal), []);
    const handleDropcsvFile = useCallback(
        (_droppedFiles, acceptedFiles, rejectedFiles) => {
            console.log('_droppedFiles', _droppedFiles)
            console.log('acc', acceptedFiles);
            setCSVFile(acceptedFiles[0])
        },
        [],
    );
    const handleCloseModal = () => {
        setActiveModal(!activeModal);
        setCSVFile(null);
        setShowPreview(false);
        setLoading(!loading);
    }

    const handleImport = () => {
        console.log('read', readFile);
        // setStoreData(readFile)
    }
    const uploadFile = () => {
        console.log('uploadFile', loading)

        setLoading(!loading);
        Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const rowsArray = [];
                const valuesArray = [];

                // Iterating data to get column name and their values
                results.data.map((d) => {
                    const formattedKeys = Object.keys(d).map(key => key.trim().replace(/\s+/g, '_'));
                    console.log('formattedKeys', formattedKeys)
                    rowsArray.push(formattedKeys);
                    valuesArray.push(Object.values(d));
                });
                console.log('res==>', results.data)
                setReadFile(results.data);

            },
        });
    }


    useEffect(() => {
        if (readFile !== undefined) {
            console.log('readFile', readFile);
            console.log('readFile', readFile[0]?.Product_Category);


            setTimeout(() => {
                console.log('setime out call', loading)
                setLoading(!loading);
                setShowPreview(!showPreview)
            }, 1000)
        }
    }, [readFile]);

    const handleBackArrowAction = () => {
        setIsShowStoreDetails(false);
        setstoreDetails(null);
        setCurrentTab(0);
        // setCurrentStorePosition({ });
        // setPhoneCode();
        // setCountryid();
        if (isEdit) {
            setIsEdit(!isEdit);
            setstoreDetails(null);
        }
    }


    function exportToCSV(data, filename = 'export.csv') {
        // Convert JSON to CSV format
        const csv = Papa.unparse(data);

        // Create a blob from the CSV
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Create a link element
        const link = document.createElement('a');

        // Set the link's download attribute
        link.href = URL.createObjectURL(blob);
        link.download = filename;

        // Programmatically click the link to trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up the link element
        document.body.removeChild(link);
    }

    const downloadCSV = () => {
        // const fileHeaders = [
        //    "store_name",
        // "store_address",
        // "store_address2",
        // "city",
        // "state",
        // "country",
        // "zipcode",
        // "phone_number",
        // "fax_number",
        // "email",
        // "website",
        // "booking_url",
        // "store_sequcence",
        // "hour_of_operation",
        // "store_marker_icon",
        // "store_image",
        // "status",
        //   ];
        exportToCSV(storeData, 'storeData.csv');
    }


    // useEffect(() => {
    //     console.log('current', currentTab);
    // }, [currentTab])

    return (
        <>
            {
                isShowStoreDetails ?
                    <Page
                        backAction={{ content: 'Stores', url: '#', onAction: () => handleBackArrowAction() }}
                        title={isEdit ? "Update Store" : "Add Store"}
                    >
                        <Tabs tabs={tabsForStore} selected={currentTab} onSelect={handleStoreTabChange}>
                        </Tabs>

                        <div style={{ padding: 16, }} >

                            {currentTab === 0 ?
                                // <Form onSubmit={handleSubmit}>
                                <Layout >
                                    <Layout.AnnotatedSection
                                        id="storeDetail"
                                        title="Store detail"
                                    >
                                        <LegacyCard sectioned>
                                            <FormLayout>
                                                <Grid>
                                                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                        <TextField
                                                            label="Store name"
                                                            requiredIndicator
                                                            required={true}
                                                            onChange={handleStoreValues}
                                                            value={storeDetails?.store_name}
                                                            autoComplete="off"
                                                            id="store_name"
                                                            placeholder="Enter Your Store Name"
                                                        />
                                                        <InlineError message={errorMessages.store_name} fieldID="store_name"></InlineError>
                                                    </Grid.Cell>
                                                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                        <Select
                                                            label="Store Status"
                                                            options={statusOptions}
                                                            onChange={(val) => handleStoreValues(val, "status")}
                                                            id="status"
                                                            value={storeDetails?.status}
                                                        />
                                                    </Grid.Cell>
                                                </Grid>
                                            </FormLayout>
                                        </LegacyCard>
                                    </Layout.AnnotatedSection>


                                    <Layout.AnnotatedSection
                                        id="Address"
                                        title="Address"
                                    >
                                        <div className="lagacyCard">
                                            <LegacyCard sectioned>

                                                <FormLayout>
                                                    <Grid>
                                                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                            <TextField
                                                                label="Store Address"
                                                                requiredIndicator
                                                                onChange={handleStoreValues}
                                                                value={storeDetails?.store_address}
                                                                autoComplete="off"
                                                                id="store_address"
                                                                required={true}
                                                                placeholder="Enter Your Store Address"
                                                            />
                                                            <InlineError message={errorMessages.store_address} fieldID="store_address"></InlineError>

                                                        </Grid.Cell>
                                                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                            <TextField
                                                                label="Store Address 2"
                                                                onChange={handleStoreValues}
                                                                value={storeDetails?.store_address2}
                                                                autoComplete="off"
                                                                id="store_address2"
                                                                placeholder="Enter Your Store Address 2"
                                                            />

                                                        </Grid.Cell>
                                                    </Grid>
                                                    <Grid>
                                                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }} className="country" id="country">
                                                            <label style={{ paddingBottom: 2 }}>Country<span className="requiredIndicator">*</span></label>
                                                            <div className="country">
                                                                <CountrySelect
                                                                    id="country"
                                                                    onChange={(e) => {
                                                                        console.log("E", e);
                                                                        setCurrentStorePosition({ lat: e.latitude, lng: e.longitude });
                                                                        setPhoneCode(e.phone_code);
                                                                        setCountryid(e.id);
                                                                        handleStoreValues(e.name, "country");
                                                                    }}
                                                                    defaultValue={isEdit && storeDetails && ({ name: storeDetails?.country })}
                                                                    placeHolder="Select Country"
                                                                    required={true}
                                                                />
                                                            </div>
                                                            <InlineError message={errorMessages.country} fieldID="country"></InlineError>
                                                            {/* <div className="Polaris-TextField__Backdrop"></div> */}
                                                        </Grid.Cell>
                                                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                            <label>State / Province<span className="requiredIndicator">*</span></label>
                                                            <div className="state">
                                                                <StateSelect
                                                                    countryid={countryid}
                                                                    onChange={(e) => {
                                                                        setstateid(e.id);
                                                                        handleStoreValues(e.name, "state")
                                                                    }}
                                                                    defaultValue={isEdit && storeDetails && ({ name: storeDetails?.state })}
                                                                    required={true}
                                                                    placeHolder="Select State"
                                                                />
                                                            </div>
                                                            <InlineError message={errorMessages.state} fieldID="state"></InlineError>

                                                        </Grid.Cell>
                                                    </Grid>
                                                    <Grid>
                                                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                            <TextField
                                                                type="text"
                                                                label="City / Town"
                                                                requiredIndicator
                                                                onChange={handleStoreValues}
                                                                value={storeDetails?.city}
                                                                id="city"
                                                                required={true}
                                                                placeholder="Enter Your City / Town"
                                                            />
                                                            <InlineError message={errorMessages.city} fieldID="city"></InlineError>
                                                        </Grid.Cell>
                                                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                            <TextField
                                                                type="text"
                                                                label="Zip / Postal Code"
                                                                requiredIndicator
                                                                onChange={handleStoreValues}
                                                                value={storeDetails?.zipcode}
                                                                id="zipcode"
                                                                required={true}
                                                                placeholder="Enter Your Zip / Postal Code *"
                                                            />
                                                            <InlineError message={errorMessages.zipcode} fieldID="zipcode"></InlineError>
                                                        </Grid.Cell>
                                                    </Grid>
                                                </FormLayout>
                                            </LegacyCard>
                                        </div>
                                    </Layout.AnnotatedSection>

                                    <Layout.AnnotatedSection
                                        id="Contact"
                                        title="Contact"
                                    >
                                        <LegacyCard sectioned>
                                            <FormLayout>
                                                <Grid>
                                                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                        <TextField
                                                            label="Phone Number"
                                                            // type="number"
                                                            requiredIndicator
                                                            onChange={handleStoreValues}
                                                            id="phone_number"
                                                            value={storeDetails?.phone_number}
                                                            autoComplete="off"
                                                            placeholder="Enter Your Phone Number"
                                                            prefix={phonecode ? `+ ${phonecode}` : ''}
                                                        />
                                                        <InlineError message={errorMessages.phone_number} fieldID="phone_number"></InlineError>

                                                    </Grid.Cell>
                                                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                        <TextField
                                                            label="Fax Number"
                                                            onChange={handleStoreValues}
                                                            id="fax_number"
                                                            value={storeDetails?.fax_number}
                                                            autoComplete="off"
                                                            placeholder="Enter Your Fax Number"
                                                        />
                                                    </Grid.Cell>
                                                </Grid>

                                                <Grid>
                                                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                        <TextField
                                                            type="email"
                                                            label="Email"
                                                            onChange={handleStoreValues}
                                                            id="email"
                                                            requiredIndicator
                                                            value={storeDetails?.email}
                                                            placeholder="Enter Your Email"
                                                        />
                                                        <InlineError message={errorMessages.email} fieldID="email"></InlineError>
                                                    </Grid.Cell>
                                                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                        <TextField
                                                            type="text"
                                                            label="Website"
                                                            onChange={handleStoreValues}
                                                            id="website"
                                                            value={storeDetails?.website}
                                                            placeholder="Enter Your Website"
                                                        />
                                                    </Grid.Cell>
                                                </Grid>
                                            </FormLayout>
                                        </LegacyCard>
                                    </Layout.AnnotatedSection>


                                    <Layout.AnnotatedSection
                                        id="StoreOtherDetail"
                                        title="Store Other Detail"
                                    >
                                        <LegacyCard sectioned>
                                            <FormLayout>
                                                <Grid>
                                                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                        <TextField
                                                            label="Booking / Schedule Url"
                                                            onChange={handleStoreValues}
                                                            id="booking_url"
                                                            value={storeDetails?.booking_url}
                                                            autoComplete="off"
                                                            placeholder="Enter Your Booking or Schedule Url"
                                                        />
                                                    </Grid.Cell>
                                                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                        <TextField
                                                            label="Store Sequence"
                                                            onChange={handleStoreValues}
                                                            id="store_sequcence"
                                                            value={storeDetails?.store_sequcence}
                                                            autoComplete="off"
                                                            placeholder="Enter Your Store Sequence"
                                                        />
                                                    </Grid.Cell>
                                                </Grid>
                                                <TextField
                                                    label="Hour of Operation"
                                                    onChange={handleStoreValues}
                                                    id="hour_of_operation"
                                                    multiline={4}
                                                    value={storeDetails?.hour_of_operation}
                                                    placeholder="Enter Your Hour of Operation"
                                                />

                                            </FormLayout>
                                        </LegacyCard>
                                    </Layout.AnnotatedSection>


                                    <Layout.AnnotatedSection
                                        id="UploadImages"
                                        title="Upload Images"
                                    >
                                        <LegacyCard sectioned>
                                            {/* <InlineStack gap={600}> */}
                                            <Grid>
                                                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                                    <Box>
                                                        <Text as="h3"> Upload Your Store Marker Icon</Text>
                                                        <div style={{ width: '100%', height: 114, paddingTop: 10, display: 'flex' }} className="drop-zone">
                                                            {errorMessage}
                                                            <DropZone allowMultiple={false} accept="image/*" type="image" onDrop={handleDrop} >
                                                                {StoreMarkerIconUpload}
                                                                {/* {storeDetails?.store_marker_icon} */}
                                                            </DropZone>
                                                            <div style={{ width: '50%' }}>
                                                                {uploadedStoreMarkerIcon}
                                                            </div>

                                                        </div>

                                                    </Box>
                                                </Grid.Cell>
                                                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>

                                                    <Box>
                                                        <Text as="h3"> Upload Store Image</Text>
                                                        <div style={{ width: '100%', height: 114, paddingTop: 10, display: 'flex' }} className="drop-zone">
                                                            {errorMessage}
                                                            <DropZone allowMultiple={false} accept="image/*" type="image" onDrop={handleDropStoreImage} >
                                                                {StoreImageUpload}
                                                                {/* {storeDetails?.store_image} */}

                                                            </DropZone>
                                                            <div style={{ width: '50%' }}>
                                                                {uploadedStoreImage}

                                                            </div>

                                                        </div>
                                                    </Box>
                                                </Grid.Cell>
                                            </Grid>
                                            {/* </InlineStack> */}

                                        </LegacyCard>
                                    </Layout.AnnotatedSection>


                                    <Layout.AnnotatedSection>
                                        <Button submit variant="primary" textAlign="end" onClick={getStoreDetails} >{isEdit ? 'UPDATE' : 'NEXT'}</Button>
                                    </Layout.AnnotatedSection>

                                </Layout>
                                // </Form>
                                :
                                <Card >
                                    <MapComponent apiKey={mapApiKey} handleStoreValues={handleStoreValues} storeDetails={storeDetails} setstoreDetails={setstoreDetails} isEdit={isEdit} setCurrentTab={setCurrentTab} currentStorePosition={currentStorePosition} handleAllValues={handleAllValues} handleUpdateStoreDetails={handleUpdateStoreDetails} fetcher={fetcher} />

                                </Card>
                            }
                        </div>
                    </Page>

                    :


                    <Page
                        fullWidth
                        title={"Stores"}
                        primaryAction={{ content: "Add New Store", onAction: () => handleAddNewStore() }}
                        secondaryActions={[
                            {
                                content: "Import CSV",
                                accessibilityLabel: "Import product list",
                                icon: <Icon
                                    source={ImportIcon}
                                    tone="base"
                                />,
                                onAction: () => downloadCSV(),
                            },
                            {
                                content: "Export CSV",
                                accessibilityLabel: "Export product list",
                                icon: <Icon
                                    source={ExportIcon}
                                    tone="base"
                                />,
                                onAction: () => toggleActive(),
                            },
                        ]}
                    >
                        <Card padding="0">
                            <IndexFilters
                                sortOptions={sortOptions}
                                sortSelected={sortSelected}
                                onSort={(val) => handleSorting(val)}

                                queryValue=""
                                onQueryChange={() => { }}
                                onQueryClear={() => { }}
                                // queryValue={queryValue}
                                // queryPlaceholder="Searching in all"
                                // onQueryChange={handleFiltersQueryChange}
                                // onQueryClear={() => { }}
                                // onSort={setSortSelected}

                                primaryAction={null}
                                canCreateNewView={false}
                                // primaryAction={primaryAction}
                                cancelAction={{
                                    onAction: onHandleCancel,
                                    disabled: false,
                                    loading: false,
                                }}
                                tabs={tabs}
                                selected={selected}
                                onSelect={setSelected}
                                // canCreateNewView
                                // onCreateNewView={onCreateNewView}

                                mode="DEFAULT"
                            // mode={mode}
                            // setMode={setMode}
                            />
                            {storeData && (
                                <IndexTable
                                    resourceName={resourceName}
                                    itemCount={storeData?.length || 8}
                                    // selectedItemsCount={
                                    //     allResourcesSelected ? "All" : selectedResources.length
                                    // }
                                    // condensed={useBreakpoints().smDown}
                                    selectable={false}

                                    onSelectionChange={handleSelectionChange}
                                    sortable={[true, true, true, true, true, true]}
                                    headings={[
                                        { title: "Name" },
                                        { title: "Country" },
                                        { title: "State" },
                                        { title: "City" },
                                        { title: "Zipcode" },
                                        { title: "Status" },
                                        { title: "View Detail" },
                                        { title: "Options" },

                                        // id, name, country, state, city, zipcode, status
                                    ]}
                                // bulkActions={bulkActions}
                                // promotedBulkActions={promotedBulkActions}
                                >

                                    {rowMarkup}

                                </IndexTable>
                            )}
                            {!storeData && (
                                <Box padding="400">
                                    <Text variant="headingMd" as="h6" alignment="center">No Store Found</Text>
                                </Box>
                            )}
                        </Card>
                    </Page>

            }

            <div style={{ height: '500px' }}>
                {/* <Frame> */}
                <AppBridgeModal
                    open={isviewDetails}
                    onClose={handlecloseModal}
                >
                    <ui-title-bar title={storeDetails?.store_name}></ui-title-bar>
                    <Box>
                        <Box padding={400}>
                            <Grid columns={{ sm: 10 }}>
                                <Grid.Cell gap={0} columnSpan={{ xs: 6, sm: 1, md: 3, lg: 1, xl: 1 }}>
                                    <Box>
                                        {storeDetails?.city && (<Icon source={LocationFilledIcon} tone="primary" />)}
                                    </Box>
                                </Grid.Cell>
                                <Grid.Cell columnSpan={{ xs: 6, sm: 5, md: 3, lg: 11, xl: 11 }}>
                                    <BlockStack>
                                        <Text as="p" variant="bodyMd">{storeDetails?.store_address}</Text>
                                        <Text as="p" variant="bodyMd">{storeDetails?.city}</Text>
                                        <Text as="p" variant="bodyMd">{storeDetails?.state} {storeDetails?.zipcode}, {storeDetails?.country}</Text>
                                    </BlockStack>
                                </Grid.Cell>
                            </Grid>
                        </Box>
                        <Divider />
                        <Box padding={400}>
                            <Text as="h4" variant="headingMd">Contact: {storeDetails?.phone_number}</Text>
                        </Box>
                        {/* <Divider /> */}
                        {/* <Text as="h3" variant="headingLg">Filters:</Text> */}
                        {/* </Box> */}
                    </Box>
                </AppBridgeModal>
                {/* </Frame> */}
            </div>
            {/* store listing by CSV  */}
            <div style={{ height: '500px' }}>
                {/* <Frame> */}
                <AppBridgeModal
                    variant="large"
                    // activator={activator}
                    open={activeModal}
                    onClose={toggleActive}
                // primaryAction={{
                //     content: showPreview ? 'Import stores' : 'Upload and preview',
                //     onAction: showPreview ? handleImport : uploadFile,
                //     loading: loading
                // }}
                // secondaryActions={[
                //     {
                //         content: 'Cancel',
                //         onAction: handleCloseModal,
                //     },

                // ]}
                // footer={<Link url="https://help.shopify.com/csv/product_template.csv" target="_blank" download
                //     external>
                //     Download sample CSV
                // </Link>}
                >
                    <ui-title-bar title={showPreview ? "Preview your first Store" : "Import store list by CSV"}>
                        <button onclick={showPreview ? handleImport : uploadFile}>{showPreview ? 'Import stores' : 'Upload and preview'}</button>
                        <button variant="primary" onclick={handleCloseModal}>
                            Cancel
                        </button>
                    </ui-title-bar>
                    {/* <a href="https://help.shopify.com/csv/product_template.csv" rel="noopener noreferrer" target="_blank" data-polaris-unstyled="true" class="Polaris-Link">Download sample CSV</a> */}
                    <Box padding={400}>
                        {showPreview ?
                            <div>
                                <div style={{ paddingTop: 6, paddingBottom: 12, }}>
                                    <Text as="p">You will be importing approximately 3 products with a total of 5 SKUs and 3 images. Importing will not overwrite any existing products that have the same product handle and will publish to all sales channels.</Text>
                                </div>
                                <Divider />
                                <DescriptionList
                                    items={[
                                        {
                                            term: 'Store Name',
                                            description: readFile[0]?.store_name,
                                        },
                                        {
                                            term: 'Address',
                                            description:
                                                readFile[0]?.store_address,
                                        },
                                        {
                                            term: 'Status',
                                            description:
                                                readFile[0]?.status,
                                        },
                                        {
                                            term: 'Country',
                                            description:
                                                readFile[0]?.country,
                                        },
                                        {
                                            term: 'Email',
                                            description:
                                                readFile[0]?.email,
                                        },
                                    ]}
                                />

                            </div>
                            :
                            // <Box width="100%">
                            < div style={{ width: '100%', maxHeight: 250, height: '100%' }} className="csvmodal">
                                {csvFile ? <Icon
                                    source={FileFilledIcon}
                                    tone="base"
                                /> :

                                    <DropZone
                                        accept=".csv"
                                        errorOverlayText="File type must be .csv"
                                        type="file"
                                        onDrop={handleDropcsvFile}
                                        fullWidth

                                    >
                                        <DropZone.FileUpload />
                                        {/* <DropZone.FileUpload /> */}
                                    </DropZone>
                                }
                            </div>
                            // </Box>
                        }
                    </Box>
                </AppBridgeModal>
                {/* </Frame> */}
            </div >
        </>
    )
}

function disambiguateLabel(key, value) {
    switch (key) {
        case 'moneySpent':
            return `Money spent is between $${value[0]} and $${value[1]}`;
        case 'taggedWith':
            return `Tagged with ${value}`;
        case 'accountStatus':
            return value.map((val) => `Customer ${val}`).join(', ');
        default:
            return value;
    }
}

function isEmpty(value) {
    if (Array.isArray(value)) {
        return value.length === 0;
    } else {
        return value === '' || value == null;
    }
}

