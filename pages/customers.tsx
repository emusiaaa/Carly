import Head from 'next/head'
import PageLayout from '../components/PageLayout'
import { GridSortModel } from "@mui/x-data-grid-pro";
import { useCallback, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Grid, Typography, Button, IconButton } from "@mui/material";
import CustomizedDialogs from "../components/reservations/popUp";
import { CarlyDataGrid } from "../components/CarlyDataGrid";
import * as React from "react";
import BlockIcon from '@mui/icons-material/Block';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [customersSize, setCustomersSize] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState<number>(3);
  const [queryOptions, setQueryOptions] = useState<GridSortModel>([]);
  const blockUser = (id: number) => {
    fetch('https://carlybackend.azurewebsites.net/customers/' + id + '/block', { method: 'post' })
      .then((response) => console.log(response))
      .then((json) => {
        fetchCustomers(pageNumber, pageSize, undefined);
      })
      .catch((error) => console.error(error))
  }
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth:70, sortable: false },
    { field: "booklyId", headerName: "Bookly ID", flex: 1, minWidth:115, sortable: false },
    { field: "surname", headerName: "Surname", flex: 1, minWidth:170, sortable: false},
    { field: "name", headerName: "Name", flex: 1, minWidth:170, sortable: false },
    {
      field: "click",
      headerName: "Block",
      maxWidth: 80,
      minWidth: 80,
      sortable: false,
      renderCell: (params) => {
        return <IconButton sx={{ color: "red", height: 30 }} onClick={() => blockUser(params.row.id)}>
          <BlockIcon />
        </IconButton>;
      }
    },
  ]

  const fetchCustomers = (page: number, size: number, sortModel?: GridSortModel | undefined) => { // TODO: Fix undefined
    setIsLoading(true);
    //let sortBy: string = sortModel.length > 0 ? '&sortBy=' + sortModel[0].field.toUpperCase() : '';
    //let sortDirection: string = sortModel.length > 0 ? '&sortDirection=' + sortModel[0].sort!.toUpperCase() : '';
    fetch('https://carlybackend.azurewebsites.net/customers?isBlocked=false' +
      '&size=' + size +
      '&page=' + (page + 1)
      //+ sortBy + sortDirection
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setCustomersSize(json.totalRecords);
        setCustomers(json.customers);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }
  useEffect(() => {
    fetchCustomers(pageNumber, pageSize, queryOptions);
  }, []);
  return (
    <>
      <Head>
        <title>Reservations</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/ColoredLogo.svg" />
      </Head>
      <main>
        <PageLayout>
          <Grid container alignItems="center"
            justifyContent="center">
            <Grid item sx={{ my: 2, width: '95%' }} >
              <Typography sx={{ textAlign: 'left' }} variant="h5" gutterBottom>
                Customers
              </Typography>
            </Grid>
            <CarlyDataGrid
              rowHeight={40}
              rowCount={customersSize}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              pageSize={pageSize}
              setPageSize={setPageSize}
              isLoading={isLoading}
              data={customers}
              fetchData={fetchCustomers}
              columns={columns} />
          </Grid>
        </PageLayout>
      </main>
    </>
  )
}

