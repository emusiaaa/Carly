import Head from 'next/head'
import PageLayout from '../../components/PageLayout'
import {
    Box,
    Button,
    FormControl,
    Grid, Icon, IconButton,
    InputLabel,
    List,
    ListItem,
    MenuItem,
    Pagination,
    Slider,
    Typography
} from "@mui/material";
import {Fragment, useCallback, useEffect, useState} from "react";
import {DataGridPro, GridSortModel} from '@mui/x-data-grid-pro';
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {CarlyDataGrid} from "../../components/CarlyDataGrid";
import * as React from "react";
import Image from 'next/image';
import { GiCarSeat } from "react-icons/gi";
import { MdLocalGasStation } from "react-icons/md";
import { RiCarFill } from "react-icons/ri";
import { TbManualGearbox } from "react-icons/tb";
import { SlMagnifier } from "react-icons/sl";
import { useRouter } from "next/router";
import {SelectField} from "../../components/SelectField";
import {SelectModel} from "../../models/selectModel";
import TextField from '@mui/material/TextField';
import { NoPhotography } from '@mui/icons-material';
import { useJwtToken } from '../../functions/useJwtToken';


export default function Cars() {
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState<number>(3);
    const [carSize, setCarSize] = useState<number>(0);
    const [queryOptions, setQueryOptions] = useState<GridSortModel>([]);

    const [brands, setBrands] = useState<SelectModel[]>([]);
    const [brand, setBrand] = useState("");
    const [fuelTypes, setFuelTypes] = useState<SelectModel[]>([]);
    const [carTypes, setCarTypes] = useState<SelectModel[]>([]);
    const [fuelType, setFuelType] = useState("");
    const [carType, setCarType] = useState("");
    const [isAutomatic, setIsAutomatic] = useState("");
    const [seats, setSeats] = React.useState<number[]>([1, 10]);
    const [productionYear, setProductionYear] = React.useState<number[]>([2000, 2023]);
    const [filterString, setFilterString] = useState("");
  const [model, setModel] = useState("");
  
  const router = useRouter();

  // use this to get the token.
    const token = useJwtToken();

    const handleChangeSeats = (event: Event, newValue: number | number[]) => {
        setSeats(newValue as number[]);
    };
    const handleChangeProduction = (event: Event, newValue: number | number[]) => {
        setProductionYear(newValue as number[]);
    };
    const handleChangeModel = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModel(event.target.value);
    };
    const searchClick = (): string => {
        let str = "";
            // "&brand=" + brands[parseInt(brand)-1].name
            // + "&fuelType=" + fuelType
            // + "&gearBox=" + isAutomatic
            // + "&model=" + model

        // console.log('Fuel types: ');
        // console.log(fuelTypes);
        console.log('por year: ' + productionYear[0]);
        // console.log("&brand=" + fuelTypes[parseInt(fuelType)-1].name);

        if (brand) {
            str += "&brand=" + brands[parseInt(brand)-1].name;
        }

        if (carType) {
            str += "&carType=" + carTypes[parseInt(carType)-1].name;
        }

        if (fuelType) {
            str += "&fuelType=" + fuelTypes[parseInt(fuelType)-1].name;
        }

        if (isAutomatic == '0' || isAutomatic == '1') {
            str += "&isGearboxAutomatic=" + isAutomatic;
        }

        if (model) {
            str += "&model=" + model;
        }

        if (productionYear) {
            str += "&yearMin=" + productionYear[0];
        }

        if (productionYear) {
            str += "&yearMax=" + productionYear[1];
        }

        if (seats) {
            str += "&seatsMin=" + seats[0];
        }

        if (seats) {
            str += "&yearMax=" + seats[1];
        }

        console.log('str: ' + str);
        setFilterString(prevState => str);
        return str;
    }
    const applyFilters = () => {
        // searchClick();
        // console.log('filterString: ' + filterString);
        // console.log('searchClick: ' + searchClick());
        fetchCars(pageNumber, pageSize, queryOptions, searchClick());
    }
    const clearFilters = () => {
        setBrand(prev => "");
        setCarType(prev => "");
        setFuelType(prev => "");
        setIsAutomatic(prev => "");
        setModel(prev => "");
        setSeats(prev => [1, 10]);
        setProductionYear(prev => [2000, 2023]);
        setFilterString(prevState => "");
        fetchCars(pageNumber, pageSize, queryOptions, "");
    }
    const columns: GridColDef[] = [
        {field: "id", headerName: "ID", flex: 0.3, minWidth: 70,},
        {
            field: "click",
            headerName: "Image",
            flex: 0.8,
            minWidth:110,
            sortable: false,
            renderCell: (params) => {
                return params.row.photos.length > 0 ?
                    <Box sx={{ height: '90%', width: '90%' }}>
                      <Image
                          alt={"Car image"} src={"https://carlybackend.azurewebsites.net/internal/images/" + params.row.photos[0]}
                          width="100"
                          height="100"
                          style={{
                            width: 'auto',
                            height: '100%',
                            borderRadius: 4
                          }}
                      />
                    </Box>

          : <Box sx={{ height: '90%', width: '90%', borderRadius: 1, backgroundColor: '#ddd', alignItems: 'center', alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
            <NoPhotography htmlColor='#999' />

          </Box>
      }

        },
        {
            field: "brand", headerName: "Brand", flex: 1, minWidth: 170, renderCell: (params: any) => {
                return <>
                    <Box sx={{mt: 0.5}}>
                        <img style={{width: 32, height: 32, marginRight: 8}}
                             src={`https://img.icons8.com/color/512/${params.row.model.brand.name.toLowerCase().replace(" ", "-")}.png`}/>
                    </Box> {params.row.model.brand.name}
                </>
            }
        },
        {
            field: "model", headerName: "Model", flex: 1, minWidth: 110,renderCell: (params) => {
                return <>
                    <Box sx={{mx: 0.5, mt: 0.5}}><RiCarFill/></Box>{params.row.model.name}
                </>
            }
        },
        {
            field: "carType", headerName: "Car Type", flex: 1, minWidth: 110,renderCell: (params: any) => {
                return <>
                    <Box sx={{mx: 0.5, mt: 0.5}}><RiCarFill/></Box> {params.row.model.carType.name}
                </>
            }
        },
        {
            field: "isGearboxAutomatic", headerName: "Gearbox", flex: 0.8, minWidth: 100,renderCell: (params: any) => {
                return <>
                    <Box sx={{
                        mx: 0.5,
                        mt: 0.5
                    }}><TbManualGearbox/></Box> {params.row.model.isGearboxAutomatic ? "Manual" : "Automatic"}
                </>
            }
        },
        {
            field: "fuelType", headerName: "Fuel Type", flex: 0.8, minWidth: 110,renderCell: (params) => {
                return <>
                    <Box sx={{mx: 0.5, mt: 0.5}}><MdLocalGasStation/></Box> {params.row.model.fuelType.name}
                </>
            }
        },
        {
            field: "numberOfSeats", headerName: "seats", flex: 0.5, minWidth: 85,
            renderCell: (params) => {
                return <>
                    <Box sx={{mx: 0.5, mt: 0.5}}><GiCarSeat/></Box> {params.row.model.numberOfSeats}
                </>
            }
        },
        {
            field: "productionYear", headerName: "year", flex: 0.5, minWidth: 70, valueGetter: (params: any) => {
                return params.row.model.productionYear;
            }
        },
        {
            field: "view", headerName: "view", flex: 0.5, minWidth: 70, renderCell: (params) => {
                return <IconButton onClick={() => {
                    let url = /cars/ + params.row.id
                    if (!(router.route === url))
                        router.push(url);
                }}><SlMagnifier /></IconButton>
            }
        },
    ]
    const fetchCars = (page: number, size: number, sortModel: GridSortModel, filters?: string | undefined) => {
        if (token === undefined) // Workaround
          return;
        let sortBy: string = sortModel.length > 0 ? '&sortBy=' + sortModel[0].field.toUpperCase() : '';
        let sortDirection: string = sortModel.length > 0 ? '&sortDirection=' + sortModel[0].sort!.toUpperCase() : '';
        setIsLoading(true);
        console.log('Fetching cars with url: ' + 'https://carlybackend.azurewebsites.net/cars?' +
            'size=' + size +
            '&page=' + (page + 1) +
            sortBy + sortDirection +
            filters);
        fetch('https://carlybackend.azurewebsites.net/cars?' +
            'size=' + size +
            '&page=' + (page + 1) +
            sortBy + sortDirection +
            filters,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
            //+ filters
        )
            .then((response) => {
              if (response.status === 401)
                throw 'Random error' // workaround
              return response.json()
            })
            .then((json) => {
                setCars(json.cars);
                setCarSize(json.totalRecords);
                setIsLoading(false)
            })
            .catch((error) => console.error(error))
    }
    const getBrands = () => {
        fetch(`https://carlybackend.azurewebsites.net/internal/brands`)
            .then((response) => response.json())
            .then((json) => {
                setBrands(json);
            })
            .catch((error) => console.error(error))
    }
    const getFuelTypes = () => {
        fetch(`https://carlybackend.azurewebsites.net/internal/fuelTypes`)
            .then((response) => response.json())
            .then((json) => {
                setFuelTypes(json)
            })
            .catch((error) => console.error(error))
    }
    const getCarTypes = () => {
        fetch(`https://carlybackend.azurewebsites.net/internal/carTypes`)
            .then((response) => response.json())
            .then((json) => {
                setCarTypes(json)
            })
            .catch((error) => console.error(error))
    }

    useEffect(() => {
        getBrands();
        getFuelTypes();
        getCarTypes();
        fetchCars(pageNumber, pageSize, queryOptions, filterString);
    }, []);

    return (
        <>
            <Head>
                <title>Car List</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/ColoredLogo.svg"/>
            </Head>
            <main>
                <PageLayout>
                    <Grid container alignItems="center"
                          justifyContent="center">
                        <Grid item sx={{my: 2, width: '95%'}}>
                            <Typography sx={{textAlign: 'left'}} variant="h5" gutterBottom>
                                CARS LIST
                            </Typography>
                        </Grid>

                        <Grid sx={{width: '95%', background: "#F7F6F3", mb:4, borderRadius: "20px"}}>
                            <Grid container spacing={5} padding={3}>
                                <Grid item xs={3}>
                                    <SelectField label={"Brand"} value={brand} setValue={setBrand}
                                                 itemList={brands} disabled={false}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <SelectField label={"Car type"} value={carType} setValue={setCarType} itemList={carTypes}
                                                 disabled={false}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <SelectField label={"Fuel type"} value={fuelType} setValue={setFuelType} itemList={fuelTypes}
                                                 disabled={false}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <SelectField label={"Gearbox"} value={isAutomatic} setValue={setIsAutomatic}
                                                 itemList={[{id:0,name:"Automatic"},{id:1,name:"Manual"}]} disabled={false}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>
                                        No of seats
                                    </Typography>
                                    <Slider
                                        getAriaLabel={() => 'Temperature range'}
                                        value={seats}
                                        onChange={handleChangeSeats}
                                        valueLabelDisplay="auto"
                                        aria-labelledby="input-slider"
                                        max={10} min={1}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>
                                        Year of production
                                    </Typography>
                                    <Slider
                                        getAriaLabel={() => 'Temperature range'}
                                        value={productionYear}
                                        onChange={handleChangeProduction}
                                        valueLabelDisplay="auto"
                                        max={2023} min={2000}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField fullWidth label="Search by model" variant="outlined" value={model} onChange={handleChangeModel}/>
                                </Grid>
                                <Grid item xs={1.5}>
                                    <Button fullWidth sx={{height: '100%'}} variant="contained" onClick={applyFilters}>Search</Button>
                                </Grid>
                                <Grid item xs={1.5}>
                                    <Button fullWidth sx={{height: '100%'}} variant="contained" onClick={clearFilters}>Clear filters</Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <CarlyDataGrid
                            rowHeight={80}
                            rowCount={carSize}
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            isLoading={isLoading}
                            data={cars}
                            fetchData={fetchCars}
                            columns={columns}
                            filters={filterString}
                        />
                    </Grid>
                </PageLayout>
            </main>
        </>
    )
}
