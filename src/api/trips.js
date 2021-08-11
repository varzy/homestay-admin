import http from '../utils/http';

export const reqFetchTrips = (params) =>
  http({
    url: `/trips`,
    method: 'GET',
    params,
  });

export const reqCreateTrip = (data) =>
  http({
    url: `/trips`,
    method: 'POST',
    data,
  });
