import ApiService from './framework/api-service.js';

function adaptPointToClient(point) {
  const adaptedPoint = {
    ...point,
    price: point.base_price,
    startDateTime: point.date_from,
    endDateTime: point.date_to,
    destinationId: point.destination,
    isFavorite: point.is_favorite,
    offerIds: point.offers,
  };

  delete adaptedPoint.base_price;
  delete adaptedPoint.date_from;
  delete adaptedPoint.date_to;
  delete adaptedPoint.destination;
  delete adaptedPoint.is_favorite;
  delete adaptedPoint.offers;

  return adaptedPoint;
}

function adaptPointToServer(point) {
  const adaptedPoint = {
    ...point,
    'base_price': Number(point.price),
    'date_from': point.startDateTime,
    'date_to': point.endDateTime,
    'destination': point.destinationId,
    'is_favorite': point.isFavorite,
    'offers': point.offerIds,
  };

  delete adaptedPoint.price;
  delete adaptedPoint.startDateTime;
  delete adaptedPoint.endDateTime;
  delete adaptedPoint.destinationId;
  delete adaptedPoint.isFavorite;
  delete adaptedPoint.offerIds;

  return adaptedPoint;
}

function adaptDestinationToClient(destination) {
  const adaptedDestination = {
    ...destination,
    photos: destination.pictures,
  };

  delete adaptedDestination.pictures;

  return adaptedDestination;
}

function adaptOfferToClient(offerGroup) {
  return offerGroup.offers.map((offer) => ({
    ...offer,
    type: offerGroup.type,
  }));
}

export default class TripApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse)
      .then((points) => points.map(adaptPointToClient));
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse)
      .then((destinations) => destinations.map(adaptDestinationToClient));
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse)
      .then((offers) => offers.flatMap(adaptOfferToClient));
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return adaptPointToClient(parsedResponse);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return adaptPointToClient(parsedResponse);
  }

  async deletePoint(point) {
    await this._load({
      url: `points/${point.id}`,
      method: 'DELETE',
    });
  }
}
