import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { properties } from './ApifyFuelprices.properties';
import { runActor } from './helpers/executeActor';

// SNIPPET 1: Make sure the constants are correct
export const ACTOR_ID = '0wi38CtP5zEKifljx' as string;

export const PACKAGE_NAME = 'n8n-nodes-fuelprices' as string;
export const CLASS_NAME = 'ApifyFuelprices' as string;
export const ClassNameCamel = CLASS_NAME.charAt(0).toLowerCase() + CLASS_NAME.slice(1); // make the first letter lowercase for name fields

export const X_PLATFORM_HEADER_ID = 'n8n' as string;
export const X_PLATFORM_APP_HEADER_ID = 'fuelprices-app' as string;

export const DISPLAY_NAME = 'Apify FuelPrices | Pay Per Result, Easy to Use, No Cookies' as string;
export const DESCRIPTION = 'Get live fuel prices, diesel, and gas price data. Pay only for the results you need - no subscriptions, no commitments. Perfect for tracking local fuel costs, building comparison apps, or analyzing price trends.  
Pay per usage: no setup, no minimums, no subscriptions.' as string;

export class ApifyFuelprices implements INodeType {
	description: INodeTypeDescription = {
		displayName: DISPLAY_NAME,
		name: ClassNameCamel,

		// SNIPPET 2: Adjust the icon of your app
		icon: 'file:logo.png',
		group: ['transform'],
		// Mismatched version and defaultVersion as a minor hack to hide "Custom API Call" resource
		version: [1],
		defaultVersion: 1,

		// SNIPPET 3: Adjust the subtitle for your Actor app.
		subtitle: 'Run Scraper',
		
		// SNIPPET 4: Make sure the description is not too large, 1 sentence should be ideal.
		description: DESCRIPTION,
		defaults: {
			name: DISPLAY_NAME,
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				displayName: 'Apify API key connection',
				name: 'apifyApi',
				required: false,
				displayOptions: {
					show: {
						authentication: ['apifyApi'],
					},
				},
			},
			{
				displayName: 'Apify OAuth2 connection',
				name: 'apifyOAuth2Api',
				required: false,
				displayOptions: {
					show: {
						authentication: ['apifyOAuth2Api'],
					},
				},
			},
		],

		properties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const data = await runActor.call(this, i);

				const addPairedItem = (item: INodeExecutionData) => ({
					...item,
					pairedItem: { item: i },
				});

				if (Array.isArray(data)) {
					returnData.push(...data.map(addPairedItem));
				} else {
					returnData.push(addPairedItem(data));
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
