type UserFavouriteStopAdd = {
    stop: string;
    stopRoutes: string[];
}

type UserFavouriteStopDelete = {
    favouriteStop: string;
}

type UserFavouriteStopRouteAdd = {
    favouriteStop: string;
    stopRoutes: string[];
}

type UserFavouriteStopRouteDelete = {
    favouriteStop: string;
    stopRoutes: string[];
}

export {
    UserFavouriteStopAdd, UserFavouriteStopDelete,
    UserFavouriteStopRouteAdd, UserFavouriteStopRouteDelete
}