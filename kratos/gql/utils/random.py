from secrets import token_urlsafe

import petname


def pk_gen():
    return token_urlsafe(64 * 6 // 8)


def gen_petname():
    return petname.Generate(4, '-', 8)
