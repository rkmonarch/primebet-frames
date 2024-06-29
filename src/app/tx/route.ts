import { primeBaseABI } from '@/utils/primebaseABI';
import { TransactionTargetResponse } from 'frames.js';
import { getFrameMessage } from 'frames.js/next/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  Abi,
  createPublicClient,
  encodeFunctionData,
  getContract,
  http,
} from 'viem';
import { baseSepolia, zoraSepolia } from 'viem/chains';

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
  const json = await req.json();

  const frameMessage = await getFrameMessage(json);

  console.log('frameMessage', frameMessage?.connectedAddress);

  if (!frameMessage) {
    throw new Error('No frame message');
  }

  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  const calldata = encodeFunctionData({
    abi: primeBaseABI,
    functionName: 'placeBet',
    args: [1],
  });

  const publicClient = createPublicClient({
    chain: zoraSepolia,
    transport: http(),
  });

  const primeBaseContract = getContract({
    address: `${address}` as any,
    abi: primeBaseABI,
    client: publicClient,
  });

  const price = await primeBaseContract.read.minimumValue();
  console.log('price', price?.toString());

  return NextResponse.json({
    chainId: `eip155:${zoraSepolia.id}`, // Remember Base Sepolia might not work on Warpcast yet
    method: 'eth_sendTransaction',
    params: {
      abi: primeBaseABI as Abi,
      to: `${address}` as any,
      data: calldata,
      value: price?.toString() ?? '0',
    },
  });
}
