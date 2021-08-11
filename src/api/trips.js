import http from '../utils/http';

export const reqFetchTrips = (params) =>
  http({
    url: `/trips`,
    method: 'GET',
    params,
  });

export const reqShowTrip = (id) =>
http({
  url: `/trips/${id}`,
  method: 'GET',
});

export const reqCreateTrip = (data) =>
  http({
    url: `/trips`,
    method: 'POST',
    data,
  });

export const reqUpdateTrip = (id, data) =>
  http({
    url: `/trips/${id}`,
    method: 'PUT',
    data,
  });

export const reqDestroyTrip = (id) =>
  http({
    url: `/trips/${id}`,
    method: 'DELETE',
  });
