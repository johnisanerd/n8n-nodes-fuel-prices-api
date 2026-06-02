import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

// Helper functions for parameter extraction
function getFixedCollectionParam(
	context: IExecuteFunctions,
	paramName: string,
	itemIndex: number,
	optionName: string,
	transformType: 'passthrough' | 'mapValues',
): Record<string, any> {
	const param = context.getNodeParameter(paramName, itemIndex, {}) as { [key: string]: any[] };
	if (!param?.[optionName]?.length) return {};

	let result = param[optionName];
	if (transformType === 'mapValues') {
		result = result.map((item: any) => item.value);
	}
	return { [paramName]: result };
}

function getJsonParam(context: IExecuteFunctions, paramName: string, itemIndex: number): Record<string, any> {
	try {
		const rawValue = context.getNodeParameter(paramName, itemIndex);
		if (typeof rawValue === 'string' && rawValue.trim() === '') {
			return {};
		}
		return { [paramName]: typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue };
	} catch (error) {
		throw new Error(`Invalid JSON in parameter "${paramName}": ${(error as Error).message}`);
	}
}

function getOptionalParam(context: IExecuteFunctions, paramName: string, itemIndex: number): Record<string, any> {
	const value = context.getNodeParameter(paramName, itemIndex);
	return value !== undefined && value !== null && value !== '' ? { [paramName]: value } : {};
}

export function buildActorInput(
	context: IExecuteFunctions,
	itemIndex: number,
	defaultInput: Record<string, any>,
): Record<string, any> {
	return {
		...defaultInput,
		// Search Location (search)
		search: context.getNodeParameter('search', itemIndex),
		// Fuel Type (fuel)
		fuel: context.getNodeParameter('fuel', itemIndex),
		// Language (lang)
		lang: context.getNodeParameter('lang', itemIndex),
		// Maximum Data Age (maxAge)
		maxAge: context.getNodeParameter('maxAge', itemIndex),
		// Output CSV Filename (output_file)
		...getOptionalParam(context, 'output_file', itemIndex),
	};
}

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

export const actorProperties: INodeProperties[] = [
  {
    "displayName": "Search Location",
    "name": "search",
    "description": "ZIP code, city name, or latitude/longitude coordinates (e.g., '11507', 'New York', '36.0816642, -115.0534345'). Coverage is primarily the United States, with some Canadian locations.",
    "required": true,
    "default": "11507",
    "type": "string"
  },
  {
    "displayName": "Fuel Type",
    "name": "fuel",
    "description": "Fuel type to search for. 1=Regular (default), 2=Midgrade, 3=Premium, 4=Diesel, 5=E85, 12=Unleaded88.",
    "required": false,
    "default": 1,
    "type": "number",
    "typeOptions": {}
  },
  {
    "displayName": "Language",
    "name": "lang",
    "description": "Language code for the search results. Currently only English is supported.",
    "required": false,
    "default": "en",
    "type": "options",
    "options": [
      {
        "name": "English (en)",
        "value": "en"
      }
    ]
  },
  {
    "displayName": "Maximum Data Age",
    "name": "maxAge",
    "description": "Maximum age of gas station data in days. Use 0 for no age restriction (all stations returned regardless of when prices were last reported). Higher values limit results to stations with prices reported within that many days.",
    "required": false,
    "default": 0,
    "type": "number",
    "typeOptions": {
      "minValue": 0
    }
  },
  {
    "displayName": "Output CSV Filename",
    "name": "output_file",
    "description": "Optional: Custom name for the output CSV file. If not provided, a timestamped filename will be automatically generated (e.g., gas_stations_11507_2025-08-19_11-01-12_1.csv).",
    "required": false,
    "default": "",
    "type": "string"
  }
];

export const properties: INodeProperties[] = [...actorProperties, ...authenticationProperties];