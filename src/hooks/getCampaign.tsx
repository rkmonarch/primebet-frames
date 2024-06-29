import React from 'react'
import { parseUnits, formatEther, createPublicClient, http, getContract } from "viem"
import { log } from 'console'
import { PRIMEBASE_FACTORY_ZORA_CONTRACT_ADDRESS } from '@/utils/constants';
import { factoryABI } from '@/utils/factoryABI';
import { zoraSepolia } from 'viem/chains';
import { primeBaseABI } from '@/utils/primebaseABI';

interface CampaignData {
    image: string;
    opp1: string;
    opp2: string;
    desc: string;
    betAmount: string;
    endTime: number;
    winner: number;
    isClosed: boolean;
}
export const parseArrayToCampaignData = (arr: (string | number | boolean | bigint)[]): CampaignData | undefined => {
    if (!arr) return
    return {
        image: arr[0] as string,
        opp1: arr[1] as string,
        opp2: arr[2] as string,
        desc: arr[3] as string,
        betAmount: formatEther(arr[4] as bigint) as string,
        endTime: arr[5] as number,
        winner: arr[6] as number,
        isClosed: arr[7] as boolean,
    };
};

async function useCampaign(contractAddress: string) {

    const publicClient = createPublicClient({
        chain: zoraSepolia,
        transport: http(),
    });

    const peasContractRegistry = getContract({
        address: contractAddress as `0x${string}`,
        abi: primeBaseABI,
        client: publicClient,
    });

    const image = await peasContractRegistry.read.imageURI();
    const opp1 = await peasContractRegistry.read.opponent1();
    const opp2 = await peasContractRegistry.read.opponent2();
    const desc = await peasContractRegistry.read.description();
    const betAmount = await peasContractRegistry.read.minimumValue();
    const endTime = await peasContractRegistry.read.endTimestamp();
  
    return {
        image: image,
        opp1: opp1,
        opp2: opp2,
        desc: desc,
        betAmount: formatEther(betAmount as bigint),
        endTime: endTime,
        winner: 0,
        isClosed: false
    }

}

export default useCampaign
