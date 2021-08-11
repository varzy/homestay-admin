import http from '../utils/http';

export const reqFetchTrips = (params) =>
  http({
    url: `/trips`,
    method: 'GET',
    params,
  });
