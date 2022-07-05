# Airlines REST API Documentation

## Planes API

### Retrieve all planes

- URL: `GET /api/planes/[?page=0][&limit=5]`
- response: 200
    - content-type: `application/json`
    - body: object
        - total: (number) total number of planes
        - planes: list of objects
            - _id: (string) the plane id
            - name: (string) the name of the plane
            - iata: (string) passenger code of the plane
            - icao: (string) crew code of the plane
            - passengerCapacity: (int or NULL) maximum passenger capacity of the plane 
            - seats: (Array[int, int] or NULL) seat map of the plane


### Retrieve a specified plane

- URL: `GET /api/planes/:id/`
- response: 200
    - content-type: `application/json`
    - body: object
        - _id: (string) the plane id
        - name: (string) the name of the plane
        - iata: (string) passenger code of the plane
        - icao: (string) crew code of the plane
        - passengerCapacity: (int or NULL) maximum passenger capacity of the plane
        - seats: (Array[int, int] or NULL) seat map of the plane
- response: 404
    - body: plane with id does not exist

