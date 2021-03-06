import ethutil from 'ethereumjs-util'
import Web3 from 'web3'

const web3 = new Web3()

export function soliditySha3(...values: any[]): string {
  return (web3.utils.soliditySha3 as any)(...values)
}

/**
 * Signs message using a Web3 account.
 */
export class Web3Signer {
  private _web3: Web3
  private _address: string

  /**
   * @param web3 Web3 instance to use for signing.
   * @param accountAddress Address of web3 account to sign with.
   */
  constructor(web3: Web3, accountAddress: string) {
    this._web3 = web3
    this._address = accountAddress
  }

  /**
   * Signs a message.
   * @param msg Message to sign.
   * @returns Promise that will be resolved with the signature bytes.
   */
  async signAsync(msg: string): Promise<Uint8Array> {
    const signature = await this._web3.eth.sign(msg, this._address)
    const sig = signature.slice(2)
    const r = ethutil.toBuffer('0x' + sig.substring(0, 64)) as Buffer
    const s = ethutil.toBuffer('0x' + sig.substring(64, 128)) as Buffer
    const v = ethutil.toBuffer(parseInt(sig.substring(128, 130), 16) + 27) as Buffer
    const mode = ethutil.toBuffer(1) as Buffer // mode = geth
    return Buffer.concat([mode, r, s, v])
  }
}
