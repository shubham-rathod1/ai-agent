import { BadRequestException } from '@nestjs/common';
import { ethers, sha256, getBytes } from 'ethers';
import * as nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';
import { TextEncoder } from 'util';
import { SignatureType } from 'src/helper/enums';
// import TronWeb from 'tronweb';
// import { SignatureType } from 'src/helper/constants';
// import { Secp256k1, Secp256k1Signature } from '@cosmjs/crypto'; // Cosmos signature verification package
// import { toBech32, fromBech32, fromBase64 } from '@cosmjs/encoding';

export const extractAddr = async (
  msg: string,
  sig: string,
  typ: SignatureType,
  pubKey?: string,
) => {

  if (
    typ === SignatureType.Solana &&
    !pubKey
    //  ||
    // (typ === SignatureType.Tron && !pubKey)
  ) {
    throw new BadRequestException(`PubKey required for ${typ}!`);
  }

  try {
    if (typ === 'EVM') {
      const recoverdAddress = ethers.verifyMessage(msg, sig);
      const extAddr = ethers.getAddress(recoverdAddress);
      return extAddr;
    } else if (typ === 'Solana') {
      // Convert the message to a Uint8Array
      const message = new TextEncoder().encode(msg);
      // Convert the signature from hex to Uint8Array
      const signature = Uint8Array.from(Buffer.from(sig, 'hex'));
      // Convert the public key from base58 to Uint8Array
      const publicKey = new PublicKey(pubKey!).toBytes();
      // Verify the signature
      const val = nacl.sign.detached.verify(message, signature, publicKey);

      if (val) {
        console.log(val);
        return pubKey;
      }
    }
    // else if (typ === 'Tron') {
    //   const isValid = TronWeb.Trx.verifyMessageV2(msg, sig);

    //   if (isValid) {
    //     return pubKey;
    //   }
    // } else if (typ === 'Cosmos' && pubKey) {
    //   const { data: pubKeyBytes, prefix } = fromBech32(pubKey);
    //   console.log(pubKeyBytes, prefix);
    //   if (prefix === 'cosmos') {
    //     const message = new TextEncoder().encode(msg);
    //     // const messageHash = sha256(message);
    //     const messageHash = ethers.getBytes(sha256(message));  // Ensures 32-byte array

    //     // Convert hex signature to Uint8Array
    //     console.log(sig);
    //     const signatureBytes = fromBase64(sig);
    //     // const signatureBytes = Uint8Array.from(Buffer.from(sig, 'hex'));
    //     console.log(signatureBytes);

    //     // Ensure the signature is 64 bytes (512 bits) long
    //     if (signatureBytes.length !== 64) {
    //       throw new BadRequestException('Invalid signature length for Cosmos');
    //     }

    //     // Split the signature into r and s components
    //     const r = signatureBytes.slice(0, 32);
    //     const s = signatureBytes.slice(32);

    //     // Create Secp256k1Signature from r and s
    //     const signature = new Secp256k1Signature(r, s);

    //     const isValid = await Secp256k1.verifySignature(
    //       signature,
    //       messageHash,
    //       pubKeyBytes
    //     );
    //     if (isValid) {
    //       const extAddr = toBech32('cosmos', pubKeyBytes);
    //       return extAddr;
    //     }
    //   } else {
    //     throw new BadRequestException('Invalid Signature!');
    //   }
    // }
  } catch (error) {
    console.log('An error occurred:', error.message);
    throw new BadRequestException('Invalid Signature!');
  }
};
