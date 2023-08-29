import {Grid} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {GridSortModel} from "@mui/x-data-grid-pro";
import {useState} from "react";

interface CarlyDataGridProps<T> {
    rowHeight: number
    rowCount: number,
    pageNumber: number,
    setPageNumber: (arg: number) => void,
    pageSize: number,
    setPageSize: (arg: number) => void,
    isLoading: boolean,
    data: T[],
    fetchData: (pageNumber: number, pageSize: number, sortModel: GridSortModel, filters?: string | undefined) => void,
    columns: GridColDef[]
    filters?: string;
}

export const CarlyDataGrid = <T, >(props: CarlyDataGridProps<T>) => {
    const {
        rowHeight,
        rowCount,
        pageNumber,
        setPageNumber,
        pageSize,
        setPageSize,
        isLoading,
        data,
        fetchData,
        columns
    } = {...props};
    const [queryOptions, setQueryOptions] = useState<GridSortModel>([]);

    const onChangePageSize = (newPageSize: number) => {
        setPageSize(newPageSize);
        // fetchData(pageNumber, newPageSize, queryOptions);

        if (typeof props.filters !== 'undefined') {
            console.log('props.filters: ' + props.filters);
            fetchData(pageNumber, newPageSize, queryOptions, props.filters);
        } else {
            console.log('props.filters !== \'undefined\'');
            fetchData(pageNumber, newPageSize, queryOptions);
        }

    }

    const onSortModelChange = (sortModel: GridSortModel) => {
        setQueryOptions(sortModel);

        if (typeof props.filters !== 'undefined') {
            console.log('props.filters: ' + props.filters);
            fetchData(pageNumber, pageSize, sortModel, props.filters);
        } else {
            console.log('props.filters !== \'undefined\'');
            fetchData(pageNumber, pageSize, sortModel);
        }

    }

    const onPageChange = (newPage: number) => {
        setPageNumber(newPage);
        // fetchData(newPage, pageSize, queryOptions);

        if (typeof props.filters !== 'undefined') {
            console.log('props.filters: ' + props.filters);
            fetchData(newPage, pageSize, queryOptions, props.filters);
        } else {
            console.log('props.filters !== \'undefined\'');
            fetchData(newPage, pageSize, queryOptions);
        }

    }
    return (
        <Grid sx={{width: '95%', background: "#F7F6F3", mb:3}}>
            <DataGrid rowCount={rowCount}
                      rowHeight={rowHeight}
                      disableColumnMenu
                      disableSelectionOnClick
                      autoHeight
                      paginationMode={"server"}
                      rowsPerPageOptions={[3, 5, 10, 20]}
                      page={pageNumber}
                      rows={data}
                      columns={columns}
                      pageSize={pageSize}
                      onPageSizeChange={onChangePageSize}
                      sortingMode="server"
                      onSortModelChange={onSortModelChange}
                      loading={isLoading}
                      onPageChange={onPageChange}
                      sx={{
                          '.MuiDataGrid-columnSeparator': {
                              display: 'none',
                          },
                          '.MuiDataGrid-columnHeaders': {
                              backgroundColor: "#ECEBE4",
                              color: "rgba(0,0,0)",
                              fontSize: 16,
                              textTransform: "uppercase",
                          },
                          "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
                              outline: "none !important",
                          },
                          "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus":
                              {
                                  outline: "none !important",
                              },
                      }}
            />
        </Grid>
    )
}