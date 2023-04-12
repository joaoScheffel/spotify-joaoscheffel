# Spotify-joaoscheffel

This project is a backend server that integrates with the Spotify API to authenticate users and retrieve their Spotify profile information. It's built using Node.js, Express, and Mongoose for MongoDB.

## Project Structure

The project has a modular and organized structure based on functionality:

- `src`: Main folder containing all source code files and folders.
    - `app.ts`: Main application file responsible for initializing the server and its components.
    - `database.ts`: Configuration and management of Mongoose connection.
    - `routes.ts`: Express routing and route handling. Implements server authorization flow and includes authentication routes.
    - `auth`: Folder containing files related to user authentication and authorization.
        - `auth.controller.ts`: Controller that manages authentication routes and handles related requests.
        - `auth.service.ts`: Service responsible for implementing authentication and authorization logic, including token verification and new access token generation.
    - `api-integration-logs`: Folder containing files related to logging of API integrations with external services.
        - `api-integration-logs.service.ts`: Service responsible for managing logs of external API integrations, such as the Spotify API.
        - `endpoint-type.ts`: File defining types of endpoints used in external API integrations.
    - `json-web-token`: Folder containing files related to JWT token generation and verification.
        - `json-web-token.service.ts`: Service responsible for generating JWT tokens for authorization and verifying JWT tokens received in requests.
    - `timestamps`: Folder containing files related to timestamps.
        - `timestamps.ts`: File defining the TimesTamps interface to be used in other files.
    - `spotify`: Folder containing files related to integration with the Spotify API.
        - `spotify.ts`: Interfaces and types of Spotify user profile.
        - `token`: Folder containing files related to Spotify tokens.
            - `spotify-token.ts`: File defining the SpotifyTokenResponse interface.
        - `spotify.service.ts`: Spotify service to handle user authentication and data retrieval. Implements part of the authorization flow mentioned above.
    - `utils`: Folder containing utility functions and middleware.
        - `factory.ts`: Contains utility functions and middleware.
- `.env`: Configuration file containing environment variables.
- `package.json`: File containing project information, including dependencies and scripts.


## Authorization Flow

This project uses the Spotify API's [Authorization Code Flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow) to authenticate users and obtain their access and refresh tokens. Users are redirected to the Spotify authorization page, where they grant permission for the application to access their data. After successful authorization, users are redirected back to the server, which then retrieves and saves their Spotify profile information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
