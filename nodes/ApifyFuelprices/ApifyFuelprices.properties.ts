import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

/**
 * Build the Apify Actor input from node parameters.
 * Only the real Actor inputs (search, fuel, maxAge) are sent; the Output / Fields
 * parameters shape the data we return, they are not part of the Actor input.
 */
export function buildActorInput(
	context: IExecuteFunctions,
	itemIndex: number,
	defaultInput: Record<string, any>,
): Record<string, any> {
	return {
		...defaultInput,
		search: context.getNodeParameter('search', itemIndex),
		fuel: context.getNodeParameter('fuel', itemIndex),
		maxAge: context.getNodeParameter('maxAge', itemIndex),
	};
}

const resourceProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Fuel Price',
				value: 'fuelPrice',
			},
		],
		default: 'fuelPrice',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['fuelPrice'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search fuel prices near a location',
				description: 'Get fuel prices and station details near a ZIP code, city, or coordinates',
			},
		],
		default: 'search',
	},
];

const actorProperties: INodeProperties[] = [
	{
		displayName: 'Search Location',
		name: 'search',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 11507, "New York, NY", or 36.0816642, -115.0534345',
		description:
			'ZIP code, city name, or latitude/longitude coordinates to search near. Coverage is primarily the United States, with some Canadian locations.',
		displayOptions: {
			show: {
				resource: ['fuelPrice'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Fuel Type',
		name: 'fuel',
		type: 'options',
		default: 1,
		description: 'Fuel grade to return prices for',
		options: [
			{ name: 'Diesel', value: 4 },
			{ name: 'E85', value: 5 },
			{ name: 'Midgrade', value: 2 },
			{ name: 'Premium', value: 3 },
			{ name: 'Regular', value: 1 },
			{ name: 'Unleaded 88', value: 12 },
		],
		displayOptions: {
			show: {
				resource: ['fuelPrice'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Maximum Data Age (Days)',
		name: 'maxAge',
		type: 'number',
		default: 0,
		typeOptions: {
			minValue: 0,
		},
		description:
			'Only return stations whose prices were reported within this many days. Use 0 for no limit.',
		displayOptions: {
			show: {
				resource: ['fuelPrice'],
				operation: ['search'],
			},
		},
	},
];

const outputProperties: INodeProperties[] = [
	{
		displayName: 'Output',
		name: 'output',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['fuelPrice'],
				operation: ['search'],
			},
		},
		options: [
			{
				name: 'Raw',
				value: 'raw',
				description: 'Return every field the API produces for each station',
			},
			{
				name: 'Selected Fields',
				value: 'selected',
				description: 'Choose exactly which fields to return',
			},
			{
				name: 'Simplified',
				value: 'simplified',
				description: 'Return a compact set of the most useful station and price fields',
			},
		],
		default: 'simplified',
		description: 'How much station data to return for each result',
	},
	{
		displayName: 'Fields to Include',
		name: 'fields',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['fuelPrice'],
				operation: ['search'],
				output: ['selected'],
			},
		},
		options: [
			{ name: 'Address Line 1', value: 'address_line1' },
			{ name: 'Address Line 2', value: 'address_line2' },
			{ name: 'Cash Price', value: 'price_cash' },
			{ name: 'Cash Price Posted Time', value: 'price_cash_postedTime' },
			{ name: 'City', value: 'address_locality' },
			{ name: 'Credit Price', value: 'price_credit' },
			{ name: 'Credit Price Posted Time', value: 'price_credit_postedTime' },
			{ name: 'Distance (Miles)', value: 'distance' },
			{ name: 'ID', value: 'id' },
			{ name: 'Postal Code', value: 'address_postalCode' },
			{ name: 'Price Unit', value: 'priceUnit' },
			{ name: 'Ratings Count', value: 'ratingsCount' },
			{ name: 'Star Rating', value: 'starRating' },
			{ name: 'State / Region', value: 'address_region' },
			{ name: 'Station Name', value: 'name' },
		],
		default: ['name', 'address_line1', 'price_cash', 'price_credit'],
		description: 'Which fields to return when Output is set to Selected Fields',
	},
];

const authenticationProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{
				name: 'API Key',
				value: 'apifyApi',
			},
			{
				name: 'OAuth2',
				value: 'apifyOAuth2Api',
			},
		],
		default: 'apifyApi',
		description: 'Choose which authentication method to use',
	},
];

export const properties: INodeProperties[] = [
	...resourceProperties,
	...actorProperties,
	...outputProperties,
	...authenticationProperties,
];
