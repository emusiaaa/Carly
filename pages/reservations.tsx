import Head from 'next/head'
import PageLayout from '../components/PageLayout'
import {GridSortModel} from "@mui/x-data-grid-pro";
import {useCallback, useEffect, useState} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Grid, Typography, Button, Box, TextField} from "@mui/material";
import CustomizedDialogs from "../components/reservations/popUp";
import {CarlyDataGrid} from "../components/CarlyDataGrid";
import * as React from "react";
import {RiCarFill} from "react-icons/ri";
import {IoCarSport, IoLocation} from "react-icons/io5";
import {AiTwotoneCalendar} from "react-icons/ai";
import {SelectField} from "../components/SelectField";
import {SelectModel} from "../models/selectModel";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import { useJwtToken } from '../functions/useJwtToken';

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [reservationsSize, setReservationsSize] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState<number>(3);
    const [queryOptions, setQueryOptions] = useState<GridSortModel>([]);

    const token = useJwtToken();
    const [filterString, setFilterString] = useState("");
    const [beginDate, setBeginDate] = React.useState<Dayjs|null>(
        null
    );
    const [endDate, setEndDate] = React.useState<Dayjs|null>(
        null
    );

    const [beginPlace, setBeginPlace] = useState("");
    const [endPlace, setEndPlace] = useState("");

    const handleChangeBeginDate = (newValue: Dayjs | null, _: any ) => {
        setBeginDate(newValue);
    };
    const handleChangeEndDate = (newValue: Dayjs | null, _: any ) => {
        setEndDate(newValue);
    };
    const handleChangeBeginPlace = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBeginPlace(event.target.value);
    };
    const handleChangeEndPlace = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndPlace(event.target.value);
    };
    const clearFilters = () => {
        setBeginDate(null);
        setEndDate(null);
        setBeginPlace("");
        setEndPlace("");
        setFilterString(prevState => "");
        fetchReservations(pageNumber, pageSize, queryOptions, "");
    }
    const searchClick = (): string =>{
        let str = "";
        if(beginDate){
            let monthstr = beginDate.month() < 9 ? "0" : "";
            let daystr = beginDate.date() < 9 ? "0" : "";
            str += "&startDate="+
                beginDate.year() + "-" +
                + monthstr + (beginDate.month() + 1) + "-"
                + daystr + (beginDate.date());
        }
        if(endDate){
            let monthstr = endDate.month() < 9 ? "0" : "";
            let daystr = endDate.date() < 9 ? "0" : "";
            str += "&startDate="+
                endDate.year() + "-" +
                + monthstr + (endDate.month() + 1) + "-"
                + daystr + (endDate.date());
        }
        if(beginPlace){
            str+= "&startPlace="+ beginPlace;
        }
        if(endPlace){
            str+= "&endPlace="+ endPlace;
        }
        console.log(str);
        setFilterString(prevState => str);
        return str;
    }
    const applyFilters = () => {
        fetchReservations(pageNumber, pageSize, queryOptions, searchClick());
    }

    const columns: GridColDef[] = [
        {field: "id", headerName: "ID", flex: 0.5, minWidth: 70},
        {
            field: "brand", headerName: "Brand", flex: 1, minWidth: 170, renderCell: (params: any) => {
                return <>
                    <Box sx={{mt: 0.5}}>
                        <img style={{width: 32, height: 32, marginRight: 8}}
                             src={`https://img.icons8.com/color/512/${params.row.car.model.brand.name.toLowerCase().replace(" ", "-")}.png`}/>
                    </Box> {params.row.car.model.brand.name}
                </>
            }
        },
        {
            field: "model", headerName: "Model", flex: 1, minWidth: 150, renderCell: (params: any) => {
                return <>
                    <Box sx={{mx: 0.5, mt: 0.5}}><IoCarSport/></Box> {params.row.car.model.name}
                </>
            }
        },
        {
            field: "beginDate", headerName: "Begin date", flex: 1, minWidth: 150, renderCell: (params: any) => {
                return <>
                    <Box sx={{mx: 0.5, mt: 0.5}}><AiTwotoneCalendar/></Box>
                    {params.row.beginDate[2] + '-' + params.row.beginDate[1] + '-' + params.row.beginDate[0]}
                </>
            }
        },
        {
            field: "endDate", headerName: "End date", flex: 1, minWidth: 130, renderCell: (params: any) => {
                return <>
                    <Box sx={{mx: 0.5, mt: 0.5}}><AiTwotoneCalendar/></Box>
                    {params.row.endDate[2] + '-' + params.row.endDate[1] + '-' + params.row.endDate[0]}
                </>
            }
        },
        {
            field: "beginPlace", headerName: "Begin Place", flex: 1, minWidth: 160, renderCell: (params: any) => {
                return <>
                    <Box sx={{mx: 0.5, mt: 0.5}}><IoLocation/></Box> {params.row.beginPlace}
                </>
            }
        },
        {
            field: "endPlace", headerName: "End Place", flex: 1, minWidth: 150, renderCell: (params: any) => {
                return <>
                    <Box sx={{mx: 0.5, mt: 0.5}}><IoLocation/></Box> {params.row.endPlace}
                </>
            }
        },
        {
            field: "click",
            headerName: "Details",
            width: 90,
            sortable: false,
            renderCell: (params) => {
                return <CustomizedDialogs data={params.row}/>;
            }
        },
    ]

    const fetchReservations = (page: number, size: number, sortModel: GridSortModel, filters?: string | undefined) => {
        if (token === undefined) // Workaround
            return;
        setIsLoading(true);
        let sortBy: string = sortModel.length > 0 ? '&sortBy=' + sortModel[0].field.toUpperCase() : '';
        // TODO ten bład
        let sortDirection: string = sortModel.length > 0 ? '&sortDirection=' + sortModel[0].sort!.toUpperCase() : '';
        fetch('https://carlybackend.azurewebsites.net/reservations?' +
            'size=' + size +
            '&page=' + (page + 1)
            + sortBy + sortDirection
            + filters,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                setReservationsSize(json.totalRecords);
                setReservations(json.reservations);
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
    }


    useEffect(() => {
        fetchReservations(pageNumber, pageSize, queryOptions, filterString);
    }, []);
    return (
        <>
            <Head>
                <title>Reservations</title>
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
                                RESERVATIONS
                            </Typography>
                        </Grid>
                        <Grid sx={{width: '95%', background: "#F7F6F3", mb: 4, borderRadius: "20px"}}>
                            <Grid container spacing={5} padding={3}>
                                <Grid item xs={2}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DesktopDatePicker
                                            label="Begin date"
                                            inputFormat="DD/MM/YYYY"
                                            value={beginDate}
                                            maxDate={endDate === null ? undefined : endDate}
                                            onChange={handleChangeBeginDate}
                                            renderInput={(params) => <TextField {...params} />}/>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={2}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DesktopDatePicker
                                            label="End date"
                                            inputFormat="DD/MM/YYYY"
                                            value={endDate}
                                            minDate={beginDate === null ? undefined : beginDate}
                                            onChange={handleChangeEndDate}
                                            renderInput={(params) => <TextField {...params} />}/>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        value={beginPlace}
                                        fullWidth
                                        label="Begin place"
                                        variant="outlined"
                                        onChange={handleChangeBeginPlace}/>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        value={endPlace}
                                        fullWidth
                                        label="End place"
                                        variant="outlined"
                                        onChange={handleChangeEndPlace}/>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        fullWidth
                                        sx={{height: '100%'}}
                                        variant="contained"
                                        onClick={applyFilters}>Search</Button>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        fullWidth
                                        sx={{height: '100%'}}
                                        variant="contained"
                                        onClick={clearFilters}>Clear filters</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <CarlyDataGrid
                            rowHeight={40}
                            rowCount={reservationsSize}
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            isLoading={isLoading}
                            data={reservations}
                            fetchData={fetchReservations}
                            columns={columns}
                            filters={filterString}/>
                    </Grid>
                </PageLayout>
            </main>
        </>
    )
}
