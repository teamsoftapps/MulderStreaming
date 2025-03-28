import {fetchBaseQuery, createApi} from '@reduxjs/toolkit/query/react';
import {BaseUrl} from '../../config/Service';
import {RootState} from '../store';
export const Auth = createApi({
  reducerPath: 'Authentication',
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
    prepareHeaders: (headers, {getState}) => {
      const token = (getState() as RootState).auth.token; // assuming token is a string now
      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Use the token directly as a string
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    signIN: builder.mutation({
      query: body => ({
        url: '/api/signin',
        method: 'POST',
        body,
      }),
    }),
    signUP: builder.mutation({
      query: body => ({
        url: '/api/signup',
        method: 'POST',
        body,
      }),
    }),

    forgetPassword: builder.mutation({
      query: body => ({
        url: '/api/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({id, password, resetPasswordVerificationCode}) => ({
        url: `/api/reset-password/${id}`,
        method: 'PATCH',
        body: {password, resetPasswordVerificationCode},
      }),
    }),

    getSubscriptionById: builder.query({
      query: id => `/subscriptions/${id}`,
    }),

    getAlbums: builder.mutation({
      query: () => ({
        url: '/api/albums',
        method: 'GET',
      }),
    }),

    getAlbumSongs: builder.mutation({
      query: albumName => ({
        url: `/api/songs/${albumName}`,
        method: 'GET',
      }),
    }),

    getAllSongs: builder.mutation({
      query: body => ({
        url: '/api/getAllSongs',
        method: 'GET',
        body,
      }),
    }),

    getAllUserPlaylist: builder.mutation({
      query: () => ({
        url: '/api/playlists',
        method: 'GET',
      }),
    }),

    addPlaylist: builder.mutation({
      query: body => ({
        url: '/api/playlists',
        method: 'POST',
        body,
      }),
    }),

    getPlaylistDetails: builder.mutation({
      query: playlistId => ({
        url: `/api/playlists/${playlistId}/songs`,
        method: 'GET',
      }),
    }),

    removePlaylist: builder.mutation({
      query: playlistId => ({
        url: `/api/playlists/${playlistId}`,
        method: 'DELETE',
      }),
    }),

    removeSong: builder.mutation({
      query: ({playlistId, body}) => ({
        url: `/api/playlists/${playlistId}/remove-song`,
        method: 'PUT',
        body,
      }),
    }),

    handleFavorite: builder.mutation({
      query: id => ({
        url: `/api/favourites/${id}`,
        method: 'GET',
      }),
    }),

    getFavorite: builder.mutation({
      query: () => ({
        url: `/api/getFavourites`,
        method: 'GET',
      }),
    }),

    confirmUser: builder.mutation({
      query: email => ({
        url: `/api/find-account/${email}`,
        method: 'GET',
      }),
    }),
    getExclusiveContent: builder.mutation({
      query: () => ({
        url: '/api/getExclusiveContent',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useSignINMutation,
  useSignUPMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetSubscriptionByIdQuery,
  useGetAlbumsMutation,
  useGetAlbumSongsMutation,
  useGetAllSongsMutation,
  useGetAllUserPlaylistMutation,
  useAddPlaylistMutation,
  useGetPlaylistDetailsMutation,
  useRemovePlaylistMutation,
  useRemoveSongMutation,
  useHandleFavoriteMutation,
  useGetFavoriteMutation,
  useConfirmUserMutation,
  useGetExclusiveContentMutation,
} = Auth;
