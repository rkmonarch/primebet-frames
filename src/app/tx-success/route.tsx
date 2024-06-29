import { primeBaseABI } from '@/utils/primebaseABI';
import { createFrames, Button } from 'frames.js/next';
import { createPublicClient, getContract, http } from 'viem';
import { zoraSepolia } from 'viem/chains';

const frames = createFrames();
const handleRequest = frames(async (ctx) => {
  const { searchParams } = new URL(ctx.url);
  const address = searchParams.get('address');

  const publicClient = createPublicClient({
    chain: zoraSepolia,
    transport: http(),
  });

  const peasContractRegistry = getContract({
    address: address as `0x${string}`,
    abi: primeBaseABI,
    client: publicClient,
  });

  const uri = await peasContractRegistry.read.uri([1]);

  const uriResponse = await fetch(uri as string);

  const metadata = (await uriResponse.json()) as {
    name: string;
    description: string;
    image: string;
  };

  return {
    image: <span>You have bought {metadata.name}</span>,
    buttons: [
      <Button action='link' key={1} target={`https://primebase.vercel.app`}>
        Check this out on PrimeBase
      </Button>,
    ],
    accepts: [
      {
        id: 'farcaster',
        version: 'vNext',
      },
      {
        id: 'xmtp',
        version: 'vNext',
      },
    ],
  };
  ``;
});

export const GET = handleRequest;
export const POST = handleRequest;
