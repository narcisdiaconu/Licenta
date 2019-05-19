// These constants are injected via webpack environment variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

export const VERSION = process.env.VERSION;
export const DEBUG_INFO_ENABLED: boolean = !!process.env.DEBUG_INFO_ENABLED;
export const SERVER_API_URL = process.env.SERVER_API_URL;
export const BUILD_TIMESTAMP = process.env.BUILD_TIMESTAMP;
// export const MAPBOX_API_TOKEN = process.env.MAPBOX_API_TOKEN;
export const MAPBOX_API_TOKEN = 'pk.eyJ1Ijoic2ljcmFuOTgiLCJhIjoiY2p2dHpveTNtM2I0ZDRhbWdjdXEwOXB3YSJ9.YzQ09lXSIgu0pBYzbO1KLQ';
