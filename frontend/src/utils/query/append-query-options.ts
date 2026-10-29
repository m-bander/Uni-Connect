import type { QueryingOptions } from "@/types/general/table";

const appendQueryOptions = (
  query: string,
  queryOptions: QueryingOptions | undefined
) => {
  if (!queryOptions) return query;

  const { filteringOptions, pageIndex, pageSize, sortingOptions } =
    queryOptions;

  let result = query;

  // TODO: I've assumed that whenever '?' exists in a query, then it already has query params
  let queryHasQueryParams = query.includes("?");
  if (!queryHasQueryParams) result += "?";

  // Building sort query
  if (typeof pageIndex === "number") {
    if (queryHasQueryParams) result += "&";
    else {
      queryHasQueryParams = true;
    }

    result += `pageIndex=${pageIndex}&pageSize=${pageSize}`;
  }

  if (sortingOptions && sortingOptions.length > 0) {
    if (queryHasQueryParams) result += "&";
    else {
      queryHasQueryParams = true;
    }

    result += "sortBy=";

    sortingOptions.forEach((option) => {
      result += `${option.attribute},`;
    });

    // Remove the extra ',' at the end
    result = result.substring(0, result.length - 1);

    result += "&sortOrder=";

    sortingOptions.forEach((option) => {
      if (option.desc) {
        result += `desc,`;
      } else {
        result += `asc,`;
      }
    });

    // Remove the extra ',' at the end
    result = result.substring(0, result.length - 1);
  }

  // Building filter query
  filteringOptions?.forEach((option) => {
    if (queryHasQueryParams) {
      result += "&";
    } else {
      queryHasQueryParams = true;
    }

    result += `${option.attribute}=${option.value}`;
  });

  return result;
};

export default appendQueryOptions;
