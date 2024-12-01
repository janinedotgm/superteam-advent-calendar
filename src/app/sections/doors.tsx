'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { Spinner } from '@/components/Spinner';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import { BlurredCard } from '@/components/blurred-card';

const doors = [7, 19, 3, 9, 11, 22, 5, 12, 8, 1, 16, 14, 20, 17, 24, 18, 23, 15, 13, 2, 4, 6, 21, 10];

interface DoorsProps {
  isRegistered: boolean;
}

export default function Doors({ isRegistered }: DoorsProps) {
  const { connected, publicKey } = useWallet();
  const [checking, setChecking] = useState(false);
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);

  const handleOpenDoor = async (doorNumber: number) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!isRegistered) {
      toast.error('Please register for the advent calendar first');
      return;
    }

    try {
      setChecking(true);
      setSelectedDoor(doorNumber);

      const response = await fetch('/api/check-winner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          doorNumber,
          publicKey: publicKey.toBase58() 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check winner');
      }

      const { isWinner, prize } = await response.json();
      if (isWinner) {
        toast.success(`Congratulations! You won ${prize}!`);
      } else {
        toast.error('Better luck next time!');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      {doors.map((doorNumber) => (
        <button
          key={doorNumber}
          onClick={() => handleOpenDoor(doorNumber)}
          disabled={checking || !connected || !isRegistered}
          className={`
            aspect-square
            rounded-lg
            flex
            items-center
            justify-center
            transition-all
            overflow-hidden
            ${checking ? 'cursor-not-allowed' : 'hover:scale-105'}
            ${(!connected || !isRegistered) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Image
            src={`/images/door${doorNumber.toString().padStart(2, '0')}.png`}
            alt={`Door ${doorNumber}`}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
}
