export type P2p = {
  address: "GQKqoMVW3BuSzFRRkfeVsLPArAkRiZkd1vkVNGeqRmJG";
  metadata: {
    name: "p2p";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "cancelEscrow";
      discriminator: [156, 203, 54, 179, 38, 72, 33, 21];
      accounts: [
        {
          name: "seller";
          writable: true;
          signer: true;
          relations: ["escrow"];
        },
        {
          name: "globalConfig";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "escrow";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [101, 115, 99, 114, 111, 119];
              },
              {
                kind: "arg";
                path: "escrowId";
              }
            ];
          };
        },
        {
          name: "mint";
          relations: ["escrow"];
        },
        {
          name: "mintVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 105, 110, 116, 95, 118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "mintVaultAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "mintVault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "sellerAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "seller";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
        }
      ];
      args: [
        {
          name: "escrowId";
          type: "u64";
        }
      ];
    },
    {
      name: "createDispute";
      discriminator: [161, 99, 53, 116, 60, 79, 149, 105];
      accounts: [
        {
          name: "disputant";
          writable: true;
          signer: true;
        },
        {
          name: "globalConfig";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "escrow";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [101, 115, 99, 114, 111, 119];
              },
              {
                kind: "arg";
                path: "escrowId";
              }
            ];
          };
        },
        {
          name: "disputeVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 105, 115, 112, 117, 116, 101, 95, 118, 97, 117, 108, 116];
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "escrowId";
          type: "u64";
        }
      ];
    },
    {
      name: "createEscrow";
      discriminator: [253, 215, 165, 116, 36, 108, 68, 80];
      accounts: [
        {
          name: "creator";
          writable: true;
          signer: true;
        },
        {
          name: "buyer";
        },
        {
          name: "globalConfig";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "escrow";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [101, 115, 99, 114, 111, 119];
              },
              {
                kind: "account";
                path: "global_config.escrow_count";
                account: "globalConfig";
              }
            ];
          };
        },
        {
          name: "mint";
        },
        {
          name: "mintVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 105, 110, 116, 95, 118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "creatorAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "creator";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "mintVaultAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "mintVault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "initialize";
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "globalConfig";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "disputeVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 105, 115, 112, 117, 116, 101, 95, 118, 97, 117, 108, 116];
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "feeBps";
          type: "u16";
        },
        {
          name: "fiatDeadlineSecs";
          type: "i64";
        },
        {
          name: "disputeDeadlineSecs";
          type: "i64";
        },
        {
          name: "disputeFeeEscrow";
          type: "u64";
        }
      ];
    },
    {
      name: "markEscrowAsPaid";
      discriminator: [79, 8, 91, 134, 186, 8, 243, 88];
      accounts: [
        {
          name: "buyer";
          writable: true;
          signer: true;
          relations: ["escrow"];
        },
        {
          name: "globalConfig";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "escrow";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [101, 115, 99, 114, 111, 119];
              },
              {
                kind: "arg";
                path: "escrowId";
              }
            ];
          };
        }
      ];
      args: [
        {
          name: "escrowId";
          type: "u64";
        }
      ];
    },
    {
      name: "releaseTokensInEscrow";
      discriminator: [18, 146, 38, 10, 112, 236, 190, 231];
      accounts: [
        {
          name: "buyer";
          writable: true;
          relations: ["escrow"];
        },
        {
          name: "seller";
          writable: true;
          signer: true;
          relations: ["escrow"];
        },
        {
          name: "globalConfig";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "escrow";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [101, 115, 99, 114, 111, 119];
              },
              {
                kind: "arg";
                path: "escrowId";
              }
            ];
          };
        },
        {
          name: "mint";
          relations: ["escrow"];
        },
        {
          name: "mintVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 105, 110, 116, 95, 118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "mintVaultAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "mintVault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "buyerAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "buyer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "escrowId";
          type: "u64";
        }
      ];
    },
    {
      name: "resolveDispute";
      discriminator: [231, 6, 202, 6, 96, 103, 12, 230];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
          relations: ["globalConfig"];
        },
        {
          name: "to";
          writable: true;
        },
        {
          name: "globalConfig";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "disputeVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 105, 115, 112, 117, 116, 101, 95, 118, 97, 117, 108, 116];
              }
            ];
          };
        },
        {
          name: "escrow";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [101, 115, 99, 114, 111, 119];
              },
              {
                kind: "arg";
                path: "escrowId";
              }
            ];
          };
        },
        {
          name: "mint";
          relations: ["escrow"];
        },
        {
          name: "mintVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 105, 110, 116, 95, 118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "toAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "to";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "mintVaultAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "mintVault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "escrowId";
          type: "u64";
        }
      ];
    },
    {
      name: "updateGlobalConfig";
      discriminator: [164, 84, 130, 189, 111, 58, 250, 200];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
          relations: ["globalConfig"];
        },
        {
          name: "globalConfig";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              }
            ];
          };
        }
      ];
      args: [
        {
          name: "authority";
          type: {
            option: "pubkey";
          };
        },
        {
          name: "feeBps";
          type: {
            option: "u16";
          };
        },
        {
          name: "fiatDeadlineSecs";
          type: {
            option: "i64";
          };
        },
        {
          name: "disputeDeadlineSecs";
          type: {
            option: "i64";
          };
        },
        {
          name: "disputeFeeEscrow";
          type: {
            option: "u64";
          };
        }
      ];
    },
    {
      name: "withdrawSpl";
      discriminator: [181, 154, 94, 86, 62, 115, 6, 186];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
          relations: ["globalConfig"];
        },
        {
          name: "globalConfig";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108, 95, 99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "mint";
        },
        {
          name: "mintVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 105, 110, 116, 95, 118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "mintVaultAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "mintVault";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "authorityAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "authority";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "escrow";
      discriminator: [31, 213, 123, 187, 186, 22, 218, 155];
    },
    {
      name: "globalConfig";
      discriminator: [149, 8, 156, 202, 160, 252, 176, 217];
    },
    {
      name: "mintVault";
      discriminator: [175, 220, 67, 8, 37, 11, 44, 145];
    }
  ];
  events: [
    {
      name: "disputeCreated";
      discriminator: [254, 202, 51, 123, 100, 152, 137, 93];
    },
    {
      name: "disputeResolved";
      discriminator: [121, 64, 249, 153, 139, 128, 236, 187];
    },
    {
      name: "escrowCancelled";
      discriminator: [98, 241, 195, 122, 213, 0, 162, 161];
    },
    {
      name: "escrowCreated";
      discriminator: [70, 127, 105, 102, 92, 97, 7, 173];
    },
    {
      name: "markEscrowAsPaid";
      discriminator: [54, 145, 18, 120, 141, 22, 147, 16];
    },
    {
      name: "tokensReleased";
      discriminator: [133, 146, 36, 133, 72, 255, 122, 204];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "escrowAlreadyTaken";
      msg: "The escrow has already been taken.";
    },
    {
      code: 6001;
      name: "signatureVerificationFailed";
      msg: "Signature verification failed.";
    },
    {
      code: 6002;
      name: "noAvailableFundsToWithdraw";
      msg: "No available funds to withdraw.";
    },
    {
      code: 6003;
      name: "cannotCancelEscrow";
      msg: "The escrow cannot be canceled.";
    },
    {
      code: 6004;
      name: "invalidEscrowState";
      msg: "Invalid escrow state for this operation.";
    },
    {
      code: 6005;
      name: "cannotDisputeEscrow";
      msg: "The escrow cannot be disputed.";
    },
    {
      code: 6006;
      name: "escrowIsNotTaken";
      msg: "The escrow is not taken yet.";
    },
    {
      code: 6007;
      name: "unauthorizedDispute";
      msg: "Unauthorized disputant.";
    },
    {
      code: 6008;
      name: "escrowAlreadyInDispute";
      msg: "The escrow is already in dispute.";
    }
  ];
  types: [
    {
      name: "disputeCreated";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u64";
          },
          {
            name: "disputant";
            type: "pubkey";
          },
          {
            name: "disputedAt";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "disputeResolved";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u64";
          },
          {
            name: "winner";
            type: "pubkey";
          },
          {
            name: "resolvedAt";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "escrow";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u64";
          },
          {
            name: "seller";
            type: "pubkey";
          },
          {
            name: "buyer";
            type: "pubkey";
          },
          {
            name: "mint";
            type: "pubkey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "state";
            type: {
              defined: {
                name: "escrowState";
              };
            };
          },
          {
            name: "disputedBy";
            type: {
              defined: {
                name: "escrowDisputedBy";
              };
            };
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "escrowCancelled";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u64";
          },
          {
            name: "seller";
            type: "pubkey";
          },
          {
            name: "mint";
            type: "pubkey";
          },
          {
            name: "returnedAmount";
            type: "u64";
          },
          {
            name: "canceledAt";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "escrowCreated";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u64";
          },
          {
            name: "seller";
            type: "pubkey";
          },
          {
            name: "mint";
            type: "pubkey";
          },
          {
            name: "amount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "escrowDisputedBy";
      type: {
        kind: "enum";
        variants: [
          {
            name: "nobody";
          },
          {
            name: "seller";
          },
          {
            name: "buyer";
          }
        ];
      };
    },
    {
      name: "escrowState";
      type: {
        kind: "enum";
        variants: [
          {
            name: "open";
            fields: ["i64"];
          },
          {
            name: "fiatPaid";
            fields: ["i64"];
          },
          {
            name: "dispute";
            fields: ["i64"];
          },
          {
            name: "reDispute";
            fields: ["i64"];
          }
        ];
      };
    },
    {
      name: "globalConfig";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "escrowCount";
            type: "u64";
          },
          {
            name: "feeBps";
            type: "u16";
          },
          {
            name: "fiatDeadlineSecs";
            type: "i64";
          },
          {
            name: "disputeDeadlineSecs";
            type: "i64";
          },
          {
            name: "disputeFeeEscrow";
            type: "u64";
          },
          {
            name: "availableLamports";
            type: "u64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "markEscrowAsPaid";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u64";
          },
          {
            name: "seller";
            type: "pubkey";
          },
          {
            name: "buyer";
            type: "pubkey";
          },
          {
            name: "markedAt";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "mintVault";
      type: {
        kind: "struct";
        fields: [
          {
            name: "mint";
            type: "pubkey";
          },
          {
            name: "availableAmount";
            type: "u64";
          },
          {
            name: "isInitialized";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "tokensReleased";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u64";
          },
          {
            name: "seller";
            type: "pubkey";
          },
          {
            name: "buyer";
            type: "pubkey";
          },
          {
            name: "mint";
            type: "pubkey";
          },
          {
            name: "amount";
            type: "u64";
          }
        ];
      };
    }
  ];
};
