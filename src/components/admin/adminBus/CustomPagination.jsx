import React from "react";
import {
  useGridApiContext,
  useGridSelector,
  gridPageSelector,
  gridPageCountSelector,
  gridPageSizeSelector,
  gridRowCountSelector,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const rowCount = useGridSelector(apiRef, gridRowCountSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  const handlePageChange = (event, value) => {
    apiRef.current.setPage(value - 1);
  };

  const handlePageSizeChange = (event) => {
    apiRef.current.setPageSize(Number(event.target.value));
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span>Rows per page:</span>
      <select
        value={pageSize}
        onChange={handlePageSizeChange}
        style={{ margin: "0 8px" }}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
      </select>
      <Pagination
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={handlePageChange}
        renderItem={(item) => <PaginationItem {...item} />}
      />
    </div>
  );
}

export default CustomPagination;
