import chainConfig from '@/chainConfig';
import { atomFamilyState } from '@/recoil/profiles/atom';
import type { AtomState as ProfileAtomState } from '@/recoil/profiles/types';
import { readValidator } from '@/recoil/validators';
import { bech32 } from 'bech32';
import { GetRecoilValue, selectorFamily } from 'recoil';

// ======================================================================
// selector utils
// ======================================================================

const getDelegatorAddress = ({
  address,
  get,
}: {
  address: string;
  get: GetRecoilValue;
}): string => {
  const consensusRegex = `^(${chainConfig.prefix.consensus})`;
  const validatorRegex = `^(${chainConfig.prefix.validator})`;
  const delegatorRegex = `^(${chainConfig.prefix.account})`;
  let selectedAddress = '';
  if (new RegExp(consensusRegex).test(address)) {
    // address given is a consensus
    const validator = get(readValidator(address));
    if (validator) {
      selectedAddress = validator.delegator;
    }
  } else if (new RegExp(validatorRegex).test(address)) {
    // address given is a validator
    const decode = bech32.decode(address).words;
    selectedAddress = bech32.encode(chainConfig.prefix.account, decode);
  } else if (new RegExp(delegatorRegex).test(address)) {
    // address given is a delegator
    selectedAddress = address;
  }
  return selectedAddress;
};

export const validatorToDelegatorAddress = (address: string) => {
  const decode = bech32.decode(address).words;
  return bech32.encode(chainConfig.prefix.account, decode);
};

/**
 * Returns a validator address if the given address is a consensus address.
 * Returns address otherwise
 */
const getReturnAddress = ({ address, get }: { address: string; get: GetRecoilValue }): string => {
  const consensusRegex = `^(${chainConfig.prefix.consensus})`;
  let selectedAddress = address;
  if (new RegExp(consensusRegex).test(address)) {
    // address given is a consensus
    const validator = get(readValidator(address));
    if (validator) {
      selectedAddress = validator.validator;
    }
  }
  return selectedAddress;
};

/**
 * Takes a delegator address and returns the profile
 * Returns null if no record found
 * ex - cosmosvalcon1... returns cosmosvaloper1...
 * @param address string
 * @returns string | null
 */
const getProfile =
  (address: string) =>
  ({ get }: { get: GetRecoilValue }): AvatarName => {
    const returnAddress = getReturnAddress({
      address,
      get,
    });
    const delegatorAddress = getDelegatorAddress({
      address,
      get,
    });
    const state = get(atomFamilyState(delegatorAddress));
    const name = state && state !== true ? state.moniker ?? address : address;
    const imageUrl = state && state !== true ? state.imageUrl ?? '' : '';
    return {
      address: returnAddress,
      name: name?.length ? name : address,
      imageUrl,
    };
  };

const getProfiles =
  (addresses: string[]) =>
  ({ get }: { get: GetRecoilValue }): AvatarName[] => {
    const profiles = addresses.map((x) => {
      const returnAddress = getReturnAddress({
        address: x,
        get,
      });
      const delegatorAddress = getDelegatorAddress({
        address: x,
        get,
      });
      const state = get(atomFamilyState(delegatorAddress));
      const name = state && state !== true ? state?.moniker ?? x : x;
      const imageUrl = state && state !== true ? state?.imageUrl ?? '' : '';
      return {
        address: returnAddress,
        name: name?.length ? name : x,
        imageUrl,
      };
    });
    return profiles;
  };

// ======================================================================
// selectors
// ======================================================================
export const writeProfile = selectorFamily<AvatarName | null, string>({
  key: 'profile.write.profile',
  get: getProfile,
  set:
    (address: string) =>
    ({ set, get }, profile) => {
      const delegatorAddress = getDelegatorAddress({
        address,
        get,
      });
      if (delegatorAddress) {
        if (!isAvatarName(profile)) {
          set(atomFamilyState(delegatorAddress), false);
        } else {
          set(atomFamilyState(delegatorAddress), {
            moniker: profile.name,
            imageUrl: profile.imageUrl ?? undefined,
          });
        }
      }

      function isAvatarName(x: typeof profile): x is AvatarName {
        if (!x) return false;
        return 'name' in x && 'imageUrl' in x;
      }
    },
});

export const readProfile = selectorFamily({
  key: 'profile.read.profile',
  get: getProfile,
});

export const readProfiles = selectorFamily({
  key: 'profile.read.profiles',
  get: getProfiles,
});

export const readDelegatorAddress = selectorFamily({
  key: 'profile.read.delegatorAddress',
  get:
    (address: string) =>
    ({ get }): string =>
      getDelegatorAddress({
        address,
        get,
      }),
});

export const readDelegatorAddresses = selectorFamily({
  key: 'profile.read.delegatorAddresses',
  get:
    (addresses: string[]) =>
    ({ get }): string[] =>
      addresses.map((x) =>
        getDelegatorAddress({
          address: x,
          get,
        })
      ),
});

export const readProfileExist = selectorFamily({
  key: 'profile.read.profileExist',
  get:
    (address: string) =>
    ({ get }): ProfileAtomState => {
      const delegatorAddress = getDelegatorAddress({
        address,
        get,
      });
      const state = get(atomFamilyState(delegatorAddress));
      return state;
    },
});

export const readProfilesExist = selectorFamily({
  key: 'profile.read.profilesExist',
  get:
    (addresses: string[]) =>
    ({ get }) => {
      const profiles: ProfileAtomState[] = addresses.map((x) => {
        const delegatorAddress = getDelegatorAddress({
          address: x,
          get,
        });
        const state = get(atomFamilyState(delegatorAddress));
        return state;
      });
      return profiles;
    },
});
