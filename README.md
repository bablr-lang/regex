# @bablr/regex

`@bablr/regex` is a fully-featured regex engine, scripted in javascript. The engine's implementation is non-backtracking, which makes it ideal for matching against streaming inputs of any kind. It is expected to be used most commonly in the building of streaming parsers, especially in conjunction with `@bablr/parserate` (coming soon!).

Not everyone needs a streaming regex engine. If you are matching a static regex against string data, it is very likely that you should be using the native regex implementation. However if you are working on data that is fundamentally a stream and this engine may save you from having to load all the data into a string first. If perf is your only reason to use this engine, make sure to do some tests to see that you are actually gaining perf. **The engine is still quite slow!**

## Performance

The non-backtracking design also means the engine is not vulnerable to the phenomenon known as catastrophic backtracking, which can make some not-uncommon naively written patterns have essentially infinite time cost to evaluate. This makes the engine more suitable for use with user-supplied patterns, especially when combined with tools like glob syntaxes which can offer users some of the power of regex (and compile to regexe) but without the steep learning curve of regex syntax.

While the engine is not vulnerable to catastrophic backtracking, it can still be attacked or misued. Bad patterns will tend to cause the engine's match state to balloon in size, consuming lots of memory.

In terms of raw performance, this library is still extremely slow -- 50x - 80x slower than native regex for normal patterns, and currently up to 2000x slower for certain patterns that do not contain any branches. Current work is on closing this perf gap, and there is reason to think it can be narrowed significantly.

## API

[test](#test)(pattern, input)  
[exec](#exec)(pattern, input)  
[execGlobal](#execglobal)(pattern, input)

**Note that this API is exported as three separate submodules, each with a slightly different purpose!**

The modules are:

- `/` (`@bablr/regex`) is the base module, for use when `input` is a sync iterator.
- `/async` (`@bablr/regex/async`) is for use with async iterables of characters, such as `bablr` might produce.
- `/async/chunked` (`@bablr/regex/async/chunked`) is meant to optimize performance when use with streams (iterables of strings, that is) such as those returned by `fs.createReadStream(path, 'utf-8')`.

### test

```js
import { test } from '@bablr/regex';
import { test as testAsync } from '@bablr/regex/async';
import { test as testChunked } from '@bablr/regex/async/chunked';

const didMatch = test(pattern, input);
const didMatch = await testAsync(pattern, input);
const didMatch = await testChunked(pattern, input);
```

`didMatch` will be `true` if `pattern` matches at some location in `input`.

### exec

```js
import { exec } from '@bablr/regex';
import { exec as execAsync } from '@bablr/regex/async';
import { exec as execChunked } from '@bablr/regex/async/chunked';

const captures = exec(pattern, input);
const captures = await execAsync(pattern, input);
const captures = await execChunked(pattern, input);
// 1-indexed by lexical order of `(` ($2 is b)
const [match, $1, $2, $3] = exec(/(a(b))(c)/, input);
```

`captures` will be the array of `[match, ...captures]` from the first location where `pattern` matches in `input`. This method differs from the spec in that it returns `[]` (**NOT** `null`) when `pattern` is not found in `input`. This is so that it may be used more nicely with destructuring. If you need to check if the match was present, you can still do it nicely with destructuring syntax:

```js
const [match = null, $1] = exec(/.*(a)/, input);

if (match !== null) console.log(`match: '${match}'`);
if ($1 !== undefined) console.log(`$1: '${$1}'`);
```

### execGlobal

<!--prettier-ignore-->
```js
import { execGlobal } from '@bablr/regex';
import { execGlobal as execGlobalAsync } from '@bablr/regex/async';
import { execGlobal as execGlobalChunked } from '@bablr/regex/async/chunked';

const [...matches] = execGlobal(pattern, input);
for await (const match of execGlobal(pattern, input)) { }
for await (const match of execGlobalChunked(pattern, input)) { }
```

`matches` is an iterable of match arrays (`Iterable[[match, ...captures], ...matches]`). If `pattern` is not found in `input` the iterable of matches will be empty. `execGlobal` interacts with the `global` (`/g`) flag. **If the `/g` flag is not present the `matches` iterable will never contain more than one match.**

## Patterns and flags

Some syntaxes are unsupported. Unsupported syntaxes are still parsed as long as they are in the well-supported [regexpp](https://github.com/mysticatea/regexpp) parser, so that you will not be allowed to write expressions which would not be compatible with other engines.

- Patterns use "unicode mode" escaping rules. Only valid escapes are syntactically legal.

- Patterns do not support lookbehind (`(?<=abc)` and `(?<!abc)`).

- Patterns do not (and will not) support backreferences (`(.)\0`).

- Patterns do not support lookahead (yet) (`(?=abc)` and `(?!abc)`). See [#11](https://github.com/bablr-lang/regex/issues/11).

- Patterns do not support named capture groups (`(?<name>)`) (yet).

- The unicode flag (`/u`) is not supported yet. Supporting it is a top priority. See [#33](https://github.com/bablr-lang/regex/issues/33).

- The sticky flag (`/y`) is partially supported. It restricts matching to only attempt to match `pattern` at the start of `input` or at the end of a global match (when `/g` is also present). Not the same as putting a `^` in the pattern, which may be affected by the multiline flag (`/m`).

## Credits

Thanks Jason Priestley! Without your [blog post](https://jasonhpriestley.com/regex) I would not have known where to start. Also thanks to my friends and family, who have heard me talk about this more than any of them could possibly want to.
