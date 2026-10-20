/* Prep plans: a guided study sequence for each Blitz.
   Each topic lists the Blitz question numbers it prepares for and the
   question generators (from blitz.js) used for its practice button. */
(function () {
  const R = String.raw;

  const PLANS = {
    '1': {
      blitz: '1',
      title: 'Blitz 1 prep plan',
      lede: 'Six short sessions that cover every question type on Blitz 1, in an order where each skill builds on the last. Read the method, check the example, then practice until you get two in a row right.',
      sessions: [
        {
          title: 'Algebra moves',
          minutes: 25,
          goal: 'Handle the two heavy algebra questions that open the quiz.',
          topics: [
            {
              title: 'Factoring out a common binomial power', qs: [1], gens: ['factor'], lesson: 'factoring',
              method: [
                R`Find every factor the two terms share. For each one, take the <strong>lowest</strong> power that appears. Include any common number.`,
                R`Pull that GCF out front and write what is left of each term inside one bracket.`,
                R`Multiply out and combine the bracket into a single polynomial.`,
                R`Check the bracket for one more common number and move it out front.`,
              ],
              example: {
                problem: R`Factor $4(x+1)^3(x-2)^2 + 2(x+1)^4(x-2)$.`,
                steps: [
                  R`Shared factors: $2$, $(x+1)^3$ (lowest power), $(x-2)^1$ (lowest power). GCF $= 2(x+1)^3(x-2)$.`,
                  R`What remains: $2(x-2)$ from the first term and $(x+1)$ from the second.`,
                  R`Combine: $2x - 4 + x + 1 = 3x - 3 = 3(x - 1)$.`,
                  R`Answer: $6(x+1)^3(x-2)(x-1)$.`,
                ],
              },
              trap: R`Taking the highest power as the GCF, or leaving a common number inside the last bracket. The answer choices are built around exactly these slips.`,
            },
            {
              title: 'Rationalizing the numerator', qs: [2], gens: ['rationalize'], lesson: 'exponents',
              method: [
                R`Multiply top and bottom by the conjugate of the numerator (same two roots, opposite sign between them).`,
                R`Multiply out only the top. It becomes a difference of squares, so the roots disappear.`,
                R`Leave the bottom factored. Cancel the $h$.`,
              ],
              example: {
                problem: R`Rationalize the numerator: $\dfrac{\sqrt{x+h} - \sqrt{x}}{h}$.`,
                steps: [
                  R`Multiply by $\dfrac{\sqrt{x+h} + \sqrt{x}}{\sqrt{x+h} + \sqrt{x}}$.`,
                  R`Top: $(x + h) - x = h$.`,
                  R`$\dfrac{h}{h(\sqrt{x+h} + \sqrt{x})} = \dfrac{1}{\sqrt{x+h} + \sqrt{x}}$.`,
                ],
              },
              trap: R`Multiplying out the denominator. Keep it as $h(\ldots)$ so the $h$ cancels cleanly.`,
            },
          ],
        },
        {
          title: 'Evaluating and combining functions',
          minutes: 30,
          goal: 'Plug inputs into functions correctly, including expressions and piecewise rules.',
          topics: [
            {
              title: 'Substituting expressions: f(a + c) and f(x + h)', qs: [3, 11], gens: ['eval', 'fxh'], lesson: 'functions',
              method: [
                R`Put the new input in parentheses and replace <strong>every</strong> $x$ with it.`,
                R`Expand $(x + h)^2 = x^2 + 2xh + h^2$. It is never just $x^2 + h^2$.`,
                R`Distribute coefficients to every term, then combine like terms.`,
              ],
              example: {
                problem: R`For $f(x) = 2x^2 - x$, find $f(x + h)$.`,
                steps: [
                  R`$f(x + h) = 2(x + h)^2 - (x + h)$.`,
                  R`$= 2(x^2 + 2xh + h^2) - x - h$.`,
                  R`$= 2x^2 + 4xh + 2h^2 - x - h$.`,
                ],
              },
              trap: R`For $f(a + c)$, there should be no $x$ left in the answer. Any choice containing $x$ is wrong.`,
            },
            {
              title: 'Evaluating piecewise functions', qs: [9], gens: ['piecewise'], lesson: 'functions',
              method: [
                R`Compare the input to each condition. Exactly one row applies.`,
                R`Watch the boundary: $\le$ includes the endpoint, $<$ does not.`,
                R`Use only that row's formula.`,
              ],
              example: {
                problem: R`$f(x) = \begin{cases} 9 & x \le -2 \\ |x + 1| & -2 < x \le 4 \\ -5 & x > 4 \end{cases}$. Find $f(-2)$, $f(0)$, and $f(4)$.`,
                steps: [
                  R`$f(-2)$: $-2 \le -2$ is true, so the first row: $9$.`,
                  R`$f(0)$: middle row, $|0 + 1| = 1$.`,
                  R`$f(4)$: $4 \le 4$, still the middle row: $|4 + 1| = 5$.`,
                ],
              },
              trap: R`Plugging into the middle formula out of habit. Always check the condition first.`,
            },
            {
              title: 'Combining functions', qs: [10, 12], gens: ['product', 'difference'], lesson: 'composition',
              method: [
                R`$(f \cdot g)(c) = f(c) \cdot g(c)$: evaluate each function first, then multiply.`,
                R`$(g - f)(x) = g(x) - f(x)$: put the subtracted function in parentheses and distribute the minus sign.`,
              ],
              example: {
                problem: R`$f(x) = 3x$, $g(x) = |x - 3|$. Find $(f \cdot g)(-3)$.`,
                steps: [
                  R`$f(-3) = -9$.`,
                  R`$g(-3) = |-6| = 6$.`,
                  R`$(f \cdot g)(-3) = -9 \cdot 6 = -54$.`,
                ],
              },
              trap: R`In $(f - g)(x)$, forgetting that the minus applies to every term of $g$, including its constant.`,
            },
          ],
        },
        {
          title: 'Domain, intercepts, and symmetry',
          minutes: 25,
          goal: 'Answer the formula questions that test definitions.',
          topics: [
            {
              title: 'Domain from a formula', qs: [7], gens: ['domain'], lesson: 'functions',
              method: [
                R`Even root ($\sqrt{\ }$): what is inside must be $\ge 0$.`,
                R`Odd root ($\sqrt[3]{\ }$): any real number works.`,
                R`Denominator: cannot equal $0$. Exclude that value with a union.`,
              ],
              example: {
                problem: R`Find the domain of $g(t) = \sqrt[3]{2 - t}$ and of $k(t) = \sqrt{2 - t}$.`,
                steps: [
                  R`Cube root: no restriction. Domain $(-\infty, \infty)$.`,
                  R`Square root: $2 - t \ge 0 \Rightarrow t \le 2$. Domain $(-\infty, 2]$.`,
                ],
              },
              trap: R`Treating a cube root like a square root. Look at the index on the radical.`,
            },
            {
              title: 'Intercepts of a line', qs: [13], gens: ['intercepts'], lesson: 'functions',
              method: [
                R`$y$-intercept: set $x = 0$. It is the constant term.`,
                R`$x$-intercept: set the function equal to $0$ and solve.`,
                R`Write each as a point: $(x, 0)$ and $(0, y)$.`,
              ],
              example: {
                problem: R`Find the intercepts of $B(x) = 6x + 8$.`,
                steps: [
                  R`$y$-intercept: $B(0) = 8$, so $(0, 8)$.`,
                  R`$x$-intercept: $6x + 8 = 0 \Rightarrow x = -\tfrac{4}{3}$, so $\left(-\tfrac43, 0\right)$.`,
                ],
              },
              trap: R`Flipping the fraction ($-\tfrac34$ instead of $-\tfrac43$) or writing the $y$-intercept as $(8, 0)$.`,
            },
            {
              title: 'Even, odd, or neither', qs: [4], gens: ['evenodd'], lesson: 'functions',
              method: [
                R`Compute $f(-x)$ and simplify. Use $|-x| = |x|$, $(-x)^2 = x^2$, $(-x)^3 = -x^3$.`,
                R`Same as $f(x)$: even. Exactly the negative of $f(x)$: odd. Otherwise: neither.`,
              ],
              example: {
                problem: R`Is $f(x) = \dfrac{x^3}{6 + |x|}$ even, odd, or neither?`,
                steps: [
                  R`$f(-x) = \dfrac{(-x)^3}{6 + |-x|} = \dfrac{-x^3}{6 + |x|}$.`,
                  R`That equals $-f(x)$, so $f$ is odd.`,
                ],
              },
              trap: R`A constant added on ($x^3 + 4$) breaks oddness. Check the whole function, not just the leading term.`,
            },
            {
              title: 'Symmetry of an equation', qs: [21], gens: ['symmetry'], lesson: 'functions',
              method: [
                R`$x$-axis test: replace $y$ with $-y$.`,
                R`$y$-axis test: replace $x$ with $-x$.`,
                R`Origin test: replace both.`,
                R`Each test passes only if you get back the exact same equation.`,
              ],
              example: {
                problem: R`Test $x = y^2 + 7$ for symmetry.`,
                steps: [
                  R`$y \to -y$: $x = (-y)^2 + 7 = y^2 + 7$. Same, so $x$-axis symmetry.`,
                  R`$x \to -x$: $-x = y^2 + 7$. Different, so no $y$-axis symmetry.`,
                  R`Both: $-x = y^2 + 7$. Different, so no origin symmetry. Answer: $x$-axis only.`,
                ],
              },
              trap: R`This question is worth 6 points, the most on the quiz. Run all three tests every time.`,
            },
          ],
        },
        {
          title: 'Reading graphs',
          minutes: 30,
          goal: 'Pull exact information off a graph: dots, arrows, and intervals.',
          topics: [
            {
              title: 'Vertical line test', qs: [6], gens: ['isfunction'], lesson: 'functions',
              method: [
                R`Imagine sweeping a vertical line across the whole graph.`,
                R`If it ever touches the graph twice, it is not a function. Circles and sideways curves always fail.`,
              ],
              trap: R`A wiggly graph is still a function as long as it never doubles back left.`,
            },
            {
              title: 'Domain and range from a graph', qs: [8], gens: ['domainrange'], lesson: 'functions',
              method: [
                R`Domain: read left to right ($x$-values). Range: read bottom to top ($y$-values).`,
                R`Closed dot: bracket $[\ ]$. Open dot: parenthesis $(\ )$. Arrow: $\infty$ or $-\infty$, always with a parenthesis.`,
              ],
              trap: R`Swapping domain and range, or using a parenthesis where a closed dot needs a bracket.`,
            },
            {
              title: 'Increasing, decreasing, constant', qs: [14], gens: ['incdec'], lesson: 'functions',
              method: [
                R`Read left to right. Rising: increasing. Falling: decreasing. Flat: constant.`,
                R`Write intervals using $x$-values only, with parentheses.`,
                R`Join separate pieces with $\cup$. If a behavior never happens, say "never".`,
              ],
              trap: R`Using $y$-values for the intervals. The interval is where on the $x$-axis it happens.`,
            },
            {
              title: 'Reading values and range with dots', qs: [17], gens: ['readgraph'], lesson: 'functions',
              method: [
                R`To find $f(c)$, go to $x = c$ and use the <strong>closed</strong> dot. An open dot is not on the graph.`,
                R`For the range, collect the $y$-values of every piece. A flat segment contributes a single value like $\{-3\}$.`,
              ],
              trap: R`Reading an open dot as the function's value.`,
            },
            {
              title: 'Relative maxima and minima', qs: [19], gens: ['extrema'], lesson: 'functions',
              method: [
                R`A relative maximum is a peak; a relative minimum is a valley.`,
                R`State it as: at $x = $ (location), the value is $y = $ (height).`,
              ],
              trap: R`Using where the graph crosses the $x$-axis. Extrema are turning points, not intercepts.`,
            },
          ],
        },
        {
          title: 'Transformations and graphing',
          minutes: 30,
          goal: 'Move parent graphs and match equations to pictures.',
          topics: [
            {
              title: 'Listing transformations in order', qs: [5], gens: ['transform'], lesson: 'transformations',
              method: [
                R`Name the parent: $\tfrac1x$, $\sqrt{x}$, $|x|$, or $x^2$.`,
                R`Horizontal shift first: $x - h$ moves right $h$, $x + h$ moves left $h$.`,
                R`Then the stretch or shrink: factor $> 1$ stretches, factor between $0$ and $1$ shrinks.`,
                R`Vertical shift last: $+k$ up, $-k$ down.`,
              ],
              example: {
                problem: R`Describe $g(x) = \dfrac{4}{x + 5} - 3$.`,
                steps: [
                  R`Parent: $f(x) = \tfrac1x$.`,
                  R`$x + 5$: shift left 5.`,
                  R`$4$ on top: stretch vertically by a factor of 4.`,
                  R`$-3$: shift down 3.`,
                ],
              },
              trap: R`Reading $x + 5$ as "right 5". Inside changes do the opposite of their sign.`,
            },
            {
              title: 'Graphing a piecewise function', qs: [15], gens: ['piecegraph'], lesson: 'functions',
              method: [
                R`Draw each formula only on its own interval.`,
                R`At the boundary: $\le$ or $\ge$ gets a closed dot; $<$ or $>$ gets an open dot.`,
              ],
              trap: R`Picking a graph with the right shapes but the dots swapped. Check both dots at the boundary.`,
            },
            {
              title: 'Shifting 1/x', qs: [16], gens: ['recipgraph'], lesson: 'transformations',
              method: [
                R`$\tfrac1x$ has asymptotes $x = 0$ and $y = 0$.`,
                R`$\tfrac1x + k$ moves the horizontal asymptote to $y = k$. $\tfrac{1}{x - h}$ moves the vertical asymptote to $x = h$.`,
                R`Find where the asymptotes moved, then pick the graph that hugs them.`,
              ],
              trap: R`Confusing a vertical shift with a horizontal one. Ask: is the change inside the denominator or outside the fraction?`,
            },
            {
              title: 'Reflections and vertical scaling', qs: [18, 20], gens: ['reflect', 'shrink'], lesson: 'transformations',
              method: [
                R`$f(-x)$: mirror across the $y$-axis (left and right swap, heights stay).`,
                R`$-f(x)$: mirror across the $x$-axis (up and down swap).`,
                R`$c \cdot f(x)$: multiply every height by $c$. Points on the $x$-axis do not move.`,
              ],
              trap: R`For $\tfrac15 f(x)$, the graph gets shorter, not narrower. Width only changes when the number is inside, as in $f(5x)$.`,
            },
          ],
        },
        {
          title: 'Dress rehearsal',
          minutes: 30,
          goal: 'Take Blitz 1 under quiz conditions and close the gaps.',
          rehearsal: true,
          steps: [
            R`Take Blitz 1 start to finish without notes. Let the timer run.`,
            R`Read the explanation for every question you missed, even lucky guesses.`,
            R`Go back to the session above that covers each miss and do two practice questions.`,
            R`Retake Blitz 1. Every attempt has new numbers. You are ready when you score 90 or more twice in a row.`,
          ],
        },
      ],
    },
    '2': {
      blitz: '2',
      title: 'Blitz 2 prep plan',
      lede: 'Seven sessions that cover every question type on Blitz 2, including the extra styles from the graded Quiz 2: composition and inverses, polynomial behavior, division, zeros, rational functions, and inequalities. Read the method, check the example, then practice until you get two in a row right.',
      sessions: [
        {
          title: 'Composition and inverses',
          minutes: 30,
          goal: 'Chain functions together and undo them.',
          topics: [
            {
              title: 'Composing functions', qs: [2, 3, 6], gens: ['compdomain', 'comppoly', 'compvalue'], lesson: 'composition',
              method: [
                R`$(f \circ g)(x) = f(g(x))$: the function on the <strong>right</strong> goes in first.`,
                R`Replace every $x$ in the outer function with the whole inner function, in parentheses.`,
                R`For a number, work inside out: find $g(c)$, then plug that result into $f$.`,
                R`Absolute value, polynomial, and linear functions have domain $(-\infty, \infty)$, so their compositions do too.`,
                R`If the two functions undo each other (they are inverses), the composition simplifies all the way to $x$.`,
              ],
              example: {
                problem: R`$f(x) = 4x^2 + 2x + 7$ and $g(x) = 2x - 3$. Find $(g \circ f)(x)$.`,
                steps: [
                  R`$g(f(x)) = 2(4x^2 + 2x + 7) - 3$.`,
                  R`Distribute: $8x^2 + 4x + 14 - 3$.`,
                  R`$= 8x^2 + 4x + 11$.`,
                ],
              },
              trap: R`Doing the composition in the wrong order. $(g \circ f)$ and $(f \circ g)$ are different, and both versions show up in the answer choices.`,
            },
            {
              title: 'One-to-one functions and inverses', qs: [10, 13], gens: ['inverse', 'onetoone'], lesson: 'composition',
              method: [
                R`One-to-one: every horizontal line hits the graph at most once (horizontal line test).`,
                R`To find an inverse: write $y = m(x)$, swap $x$ and $y$, then solve for $y$.`,
                R`Undo operations in reverse order: subtract the constant, divide by the coefficient, then take the root.`,
              ],
              example: {
                problem: R`Find the inverse of $m(x) = 7x^3 + 2$.`,
                steps: [
                  R`Swap: $x = 7y^3 + 2$.`,
                  R`Subtract 2: $x - 2 = 7y^3$.`,
                  R`Divide by 7: $y^3 = \dfrac{x - 2}{7}$.`,
                  R`Cube root: $m^{-1}(x) = \sqrt[3]{\dfrac{x - 2}{7}}$.`,
                ],
              },
              trap: R`Writing $x + 2$ instead of $x - 2$, or forgetting the root. Each wrong choice skips or flips one step.`,
            },
            {
              title: 'Inverse of a rational function', qs: [10], gens: ['inverse'], lesson: 'composition',
              method: [
                R`Swap $x$ and $y$, then multiply both sides by the denominator to clear the fraction.`,
                R`Get the $y$ term alone on one side, then divide.`,
                R`Split the answer into two fractions if the choices are written that way.`,
              ],
              example: {
                problem: R`Find the inverse of $f(x) = \dfrac{3}{4x - 5}$.`,
                steps: [
                  R`Swap: $x = \dfrac{3}{4y - 5}$.`,
                  R`Clear the fraction: $x(4y - 5) = 3$, so $4xy - 5x = 3$.`,
                  R`Isolate: $4xy = 3 + 5x$, so $y = \dfrac{3 + 5x}{4x} = \dfrac{3}{4x} + \dfrac{5}{4}$.`,
                ],
              },
              trap: R`Flipping the fraction to get $\dfrac{4x - 5}{3}$. That is the reciprocal, not the inverse. Also watch for an answer written in $y$ instead of $x$.`,
            },
          ],
        },
        {
          title: 'Polynomial behavior',
          minutes: 25,
          goal: 'Read end behavior, zeros, and multiplicities straight from the formula.',
          topics: [
            {
              title: 'End behavior', qs: [5], gens: ['endbehavior'], lesson: 'polynomial-rational',
              method: [
                R`Look only at the leading term $ax^n$.`,
                R`Even degree: both ends match. Up if $a > 0$, down if $a < 0$.`,
                R`Odd degree: ends are opposite. $a > 0$: falls left, rises right. $a < 0$: rises left, falls right.`,
              ],
              trap: R`Using the first term that is written instead of the highest power. Find the biggest exponent first.`,
            },
            {
              title: 'Zeros, multiplicities, and building a polynomial', qs: [20, 21], gens: ['multiplicity', 'fromzeros'], lesson: 'polynomial-rational',
              method: [
                R`Factor $(x - c)^m$ gives zero $c$ with multiplicity $m$. Note the sign flips: $(x + 9)$ gives $-9$.`,
                R`A factor $x^m$ is the zero $0$ with multiplicity $m$. A constant in front is not a zero.`,
                R`To build a polynomial from zeros, write $(x - c)$ for each zero and multiply out.`,
              ],
              example: {
                problem: R`Write a degree 3 polynomial with zeros 1, 5, and 6.`,
                steps: [
                  R`$f(x) = (x - 1)(x - 5)(x - 6)$.`,
                  R`$(x - 1)(x - 5) = x^2 - 6x + 5$.`,
                  R`$(x^2 - 6x + 5)(x - 6) = x^3 - 12x^2 + 41x - 30$.`,
                ],
              },
              trap: R`Forgetting the zero at $x = 0$ that comes from a factor like $5x^6$.`,
            },
            {
              title: 'Intermediate value theorem', qs: [12], gens: ['ivt'], lesson: 'polynomial-rational',
              method: [
                R`Evaluate $f$ at both endpoints of the interval.`,
                R`Opposite signs: a polynomial must cross zero in between, so yes.`,
                R`Same sign: the theorem does not guarantee a zero, so no.`,
                R`When the choices list the values, compute both carefully first; only one choice has both numbers right.`,
              ],
              trap: R`Arithmetic slips with negatives cubed. $(-2)^3 = -8$, and $-5(-2) = +10$.`,
            },
          ],
        },
        {
          title: 'Dividing polynomials',
          minutes: 25,
          goal: 'Divide by a linear factor with long division and synthetic division.',
          topics: [
            {
              title: 'Long division', qs: [15], gens: ['longdiv'], lesson: 'polynomial-rational',
              method: [
                R`Divide the leading term by the divisor's leading term. Write it on top.`,
                R`Multiply the whole divisor by it, subtract, and bring down the next term.`,
                R`Repeat until the remainder has lower degree than the divisor.`,
              ],
              example: {
                problem: R`$(12x^3 + 7x^2 - 2x + 10) \div (4x + 5)$.`,
                steps: [
                  R`$12x^3 \div 4x = 3x^2$. Subtract $3x^2(4x + 5) = 12x^3 + 15x^2$: left with $-8x^2 - 2x$.`,
                  R`$-8x^2 \div 4x = -2x$. Subtract $-2x(4x + 5) = -8x^2 - 10x$: left with $8x + 10$.`,
                  R`$8x \div 4x = 2$. Subtract $2(4x + 5)$: remainder $0$. Answer $3x^2 - 2x + 2$.`,
                ],
              },
              trap: R`Subtracting only the first term. Subtract the entire product, and watch the sign of every term.`,
            },
            {
              title: 'Synthetic division', qs: [18], gens: ['synthetic'], lesson: 'polynomial-rational',
              method: [
                R`Dividing by $(x - c)$: put $c$ in the box. For $(x + 4)$, use $-4$.`,
                R`Write all coefficients, using $0$ for any missing power.`,
                R`Bring down, multiply by $c$, add. Repeat across.`,
                R`The last number is the remainder; write it as $\dfrac{\text{remainder}}{x - c}$.`,
              ],
              example: {
                problem: R`$(s^4 - 2s^3 - 19s^2 + 26s + 32) \div (s + 4)$.`,
                steps: [
                  R`Box: $-4$. Coefficients: $1, -2, -19, 26, 32$.`,
                  R`Bottom row: $1, -6, 5, 6, 8$.`,
                  R`Answer: $s^3 - 6s^2 + 5s + 6 + \dfrac{8}{s + 4}$.`,
                ],
              },
              trap: R`Using $+4$ in the box for $(s + 4)$. One answer choice is exactly that mistake.`,
            },
          ],
        },
        {
          title: 'Finding zeros',
          minutes: 35,
          goal: 'Find every zero, rational and complex.',
          topics: [
            {
              title: 'Possible rational zeros', qs: [14], gens: ['rationalzeros'], lesson: 'polynomial-rational',
              method: [
                R`List the factors $p$ of the constant term and the factors $q$ of the leading coefficient.`,
                R`Possible rational zeros are $\pm\dfrac{p}{q}$. Always include both signs.`,
              ],
              trap: R`Dropping the $\pm$, or putting the constant's factors on the bottom. A negative leading coefficient (like $-49x^4$) changes nothing: use the factors of 49.`,
            },
            {
              title: 'Factoring with a known zero', qs: [7], gens: ['factorzero'], lesson: 'polynomial-rational',
              method: [
                R`A zero $c$ means $(x - c)$ is a factor. A zero of $-3$ gives $(x + 3)$.`,
                R`Synthetic division by $c$ leaves a quadratic.`,
                R`Factor the quadratic to finish.`,
              ],
              example: {
                problem: R`Factor $4x^3 - 17x^2 - 111x - 72$ given that $-3$ is a zero.`,
                steps: [
                  R`Synthetic division by $-3$: bottom row $4, -29, -24, 0$.`,
                  R`Quadratic: $4x^2 - 29x - 24 = (4x + 3)(x - 8)$.`,
                  R`Answer: $(x + 3)(4x + 3)(x - 8)$.`,
                ],
              },
              trap: R`Writing $(x - 3)$ for a zero of $-3$.`,
            },
            {
              title: 'Complex zeros', qs: [8, 9], gens: ['complexzeros', 'solvegiven'], lesson: 'polynomial-rational',
              method: [
                R`Complex zeros come in conjugate pairs: if $a - bi$ is a zero, so is $a + bi$.`,
                R`Their product is the quadratic $x^2 - 2ax + (a^2 + b^2)$. Divide it out.`,
                R`A rational zero $\tfrac{p}{q}$ gives the factor $(qx - p)$. Divide it out too, then factor what is left.`,
                R`For a cubic with no given zeros, test rational candidates, then use the quadratic formula on the rest.`,
              ],
              example: {
                problem: R`Find all zeros of $x^3 + 3x^2 + 16x + 130$.`,
                steps: [
                  R`Test $x = -5$: $-125 + 75 - 80 + 130 = 0$. So $(x + 5)$ is a factor.`,
                  R`Divide: $x^2 - 2x + 26$.`,
                  R`Quadratic formula: $x = \dfrac{2 \pm \sqrt{4 - 104}}{2} = 1 \pm 5i$.`,
                  R`Zeros: $-5,\ 1 \pm 5i$.`,
                ],
              },
              trap: R`Flipping the sign of the real part of the complex zeros. $1 \pm 5i$ and $-1 \pm 5i$ are both offered.`,
            },
            {
              title: 'Quadratic-form polynomials', qs: [8], gens: ['complexzeros'], lesson: 'polynomial-rational',
              method: [
                R`If only even powers appear ($x^4$, $x^2$, constant), let $u = x^2$ and factor like a quadratic.`,
                R`$x^2 = k$ with $k > 0$ gives $x = \pm\sqrt{k}$. $\ x^2 = -k$ gives $x = \pm\sqrt{k}\,i$.`,
              ],
              example: {
                problem: R`Find all zeros of $x^4 - 5x^2 - 36$.`,
                steps: [
                  R`$u^2 - 5u - 36 = (u - 9)(u + 4)$.`,
                  R`$x^2 = 9$ gives $x = \pm 3$.`,
                  R`$x^2 = -4$ gives $x = \pm 2i$. Zeros: $\pm 3,\ \pm 2i$.`,
                ],
              },
              trap: R`Forgetting the square root ($\pm 13$ instead of $\pm\sqrt{13}$), or dropping the $i$ on the negative factor.`,
            },
            {
              title: 'Quartic with one complex zero given', qs: [9], gens: ['solvegiven'], lesson: 'polynomial-rational',
              method: [
                R`Write the conjugate zero too: $a + bi$ comes with $a - bi$.`,
                R`Their quadratic factor is $x^2 - 2ax + (a^2 + b^2)$.`,
                R`Divide it out of the quartic; solve the quadratic that is left.`,
              ],
              example: {
                problem: R`$f(x) = x^4 - 2x^3 + 2x^2 + 6x - 15$, and $1 + 2i$ is a zero. Find all zeros.`,
                steps: [
                  R`The conjugate $1 - 2i$ is also a zero. Factor: $x^2 - 2x + 5$.`,
                  R`Divide: $f(x) = (x^2 - 2x + 5)(x^2 - 3)$.`,
                  R`$x^2 = 3$ gives $\pm\sqrt{3}$. Zeros: $\pm\sqrt{3},\ 1 \pm 2i$.`,
                ],
              },
              trap: R`Writing $\pm 1 + 2i$ instead of $1 \pm 2i$. The $\pm$ goes on the imaginary part.`,
            },
          ],
        },
        {
          title: 'Rational functions',
          minutes: 30,
          goal: 'Find domain and every kind of asymptote.',
          topics: [
            {
              title: 'Domain and vertical asymptotes', qs: [4, 19], gens: ['ratdomain', 'vasym'], lesson: 'polynomial-rational',
              method: [
                R`Set the denominator equal to $0$ and solve. Those $x$-values are excluded from the domain.`,
                R`Vertical asymptotes are at those values (after cancelling any common factor).`,
                R`$x^2 + k$ with $k > 0$ is never zero: no restriction and no vertical asymptote.`,
                R`Find the excluded values <strong>before</strong> cancelling. $\dfrac{x^2 - 25}{x + 5}$ simplifies to $x - 5$, but $x = -5$ is still excluded (a hole).`,
              ],
              trap: R`Solving $x^2 + 64 = 0$ as $x = \pm 8$. That is $x^2 - 64$. A sum of squares has no real zeros.`,
            },
            {
              title: 'Horizontal and slant asymptotes', qs: [1, 11], gens: ['asym2', 'hacross'], lesson: 'polynomial-rational',
              method: [
                R`Compare degrees of top ($n$) and bottom ($d$).`,
                R`$n < d$: $y = 0$. $\ n = d$: $y = $ ratio of leading coefficients. $\ n = d + 1$: slant asymptote, found by long division (ignore the remainder).`,
                R`For long division, write $0$ for any missing power (like $0x^2$) so the terms line up.`,
                R`To find where the graph crosses a horizontal asymptote $y = L$, solve $f(x) = L$. For $y = 0$, that is where the numerator is $0$.`,
              ],
              example: {
                problem: R`Find the slant asymptote of $\dfrac{4x^3 + 3x + 3}{2x^2 - 4x + 3}$.`,
                steps: [
                  R`$4x^3 \div 2x^2 = 2x$. Subtract $2x(2x^2 - 4x + 3) = 4x^3 - 8x^2 + 6x$: left with $8x^2 - 3x + 3$.`,
                  R`$8x^2 \div 2x^2 = 4$. The quotient is $2x + 4$.`,
                  R`Slant asymptote: $y = 2x + 4$.`,
                ],
              },
              trap: R`Choosing the <strong>remainder</strong> instead of the quotient. Here the remainder is $13x - 9$, and it is offered as a choice; the asymptote is the quotient, $y = 2x + 4$. Also: do not use the ratio of leading coefficients when the degrees are not equal.`,
            },
          ],
        },
        {
          title: 'Inequalities',
          minutes: 20,
          goal: 'Solve polynomial and rational inequalities with a sign chart.',
          topics: [
            {
              title: 'Quadratic inequalities', qs: [16], gens: ['quadineq'], lesson: 'equations',
              method: [
                R`If the leading coefficient is negative, multiply by $-1$ and flip the inequality.`,
                R`If the leading coefficient is not 1, factor with the ac method: $2x^2 - 5x - 3 = (2x + 1)(x - 3)$, zeros $-\tfrac12$ and $3$.`,
                R`Factor and find the zeros. They split the number line into three intervals.`,
                R`Test one value per interval. Use brackets for $\le$ or $\ge$, parentheses for $<$ or $>$.`,
              ],
              example: {
                problem: R`Solve $-x^2 - 12x - 32 \le 0$.`,
                steps: [
                  R`Multiply by $-1$ and flip: $x^2 + 12x + 32 \ge 0$.`,
                  R`Factor: $(x + 8)(x + 4) \ge 0$. Zeros: $-8$ and $-4$.`,
                  R`Positive outside the zeros: $(-\infty, -8] \cup [-4, \infty)$.`,
                ],
              },
              trap: R`Forgetting to flip the sign when multiplying by $-1$, which swaps inside and outside.`,
            },
            {
              title: 'Rational inequalities', qs: [17], gens: ['ratineq'], lesson: 'equations',
              method: [
                R`Find where the numerator is $0$ and where the denominator is $0$.`,
                R`Check the sign of each piece. A square like $x^2$ is never negative; $x^2 + k$ is always positive.`,
                R`$\ge 0$ includes the zeros; $> 0$ excludes them. If nothing works, the answer is no solution.`,
              ],
              trap: R`Treating $x^2 + 81$ as if it had zeros at $\pm 9$.`,
            },
            {
              title: 'Rational inequalities with linear pieces', qs: [17], gens: ['ratineq'], lesson: 'equations',
              method: [
                R`Find the zero of the numerator and the zero of the denominator. They split the line into three intervals.`,
                R`Test one number in each interval to see where the fraction is positive or negative.`,
                R`The denominator's zero is never included. The numerator's zero is included only for $\le$ or $\ge$.`,
              ],
              example: {
                problem: R`Solve $\dfrac{2x - 5}{x + 1} \ge 0$.`,
                steps: [
                  R`Numerator zero: $x = \tfrac52$. Denominator zero: $x = -1$.`,
                  R`Test $x = 0$: $\tfrac{-5}{1} < 0$. Test $x = 3$: $\tfrac{1}{4} > 0$. Test $x = -2$: $\tfrac{-9}{-1} > 0$.`,
                  R`Positive on the outside pieces: $(-\infty, -1) \cup \left[\tfrac52, \infty\right)$.`,
                ],
              },
              trap: R`Using a bracket at the denominator's zero, or flipping the signs of the two key numbers.`,
            },
          ],
        },
        {
          title: 'Dress rehearsal',
          minutes: 30,
          goal: 'Take Blitz 2 under quiz conditions and close the gaps.',
          rehearsal: true,
          steps: [
            R`Take Blitz 2 start to finish without notes. Let the timer run.`,
            R`Read the explanation for every question you missed, even lucky guesses.`,
            R`Go back to the session above that covers each miss and do two practice questions.`,
            R`Retake Blitz 2. Every attempt has new numbers. You are ready when you score 90 or more twice in a row.`,
          ],
        },
      ],
    },
    '3': {
      blitz: '3',
      title: 'Blitz 3 prep plan',
      lede: 'Six sessions that cover every question type on Blitz 3: what a logarithm is, the log rules, exponential and log graphs, and solving equations. Read the method, check the example, then practice until you get two in a row right.',
      sessions: [
        {
          title: 'What a logarithm means',
          minutes: 25,
          goal: 'Move between exponential and log form, and evaluate logs.',
          topics: [
            {
              title: 'Exponential form and log form', qs: [14], gens: ['logform'], lesson: 'exp-log',
              method: [
                R`$b^y = x$ is the same statement as $\log_b x = y$.`,
                R`The base stays the base. The logarithm <strong>equals the exponent</strong>.`,
              ],
              example: {
                problem: R`Write $6^3 = 216$ in logarithmic form.`,
                steps: [R`Base 6, exponent 3, result 216.`, R`$\log_6 216 = 3$.`],
              },
              trap: R`Putting the result in the base, as in $\log_{216} 6 = 3$.`,
            },
            {
              title: 'Evaluating logs exactly', qs: [3], gens: ['evallog'], lesson: 'exp-log',
              method: [
                R`Write the base and the argument as powers of the same number.`,
                R`Ask: what exponent turns the base into the argument?`,
                R`Fraction bases flip signs: $\tfrac{1}{7} = 7^{-1}$.`,
              ],
              example: {
                problem: R`Simplify $\log_{1/7} 49$.`,
                steps: [
                  R`$\tfrac{1}{7} = 7^{-1}$ and $49 = 7^2$.`,
                  R`$(7^{-1})^y = 7^2$ means $-y = 2$.`,
                  R`$y = -2$.`,
                ],
              },
              trap: R`Answering $2$ by ignoring the fraction base.`,
            },
            {
              title: 'Change of base', qs: [1], gens: ['changebase'], lesson: 'exp-log',
              method: [
                R`$\log_b a = \dfrac{\ln a}{\ln b}$ (or use $\log$ on both).`,
                R`The <strong>argument</strong> goes on top, the <strong>base</strong> on the bottom.`,
                R`Round only at the end, to 4 decimal places.`,
              ],
              example: {
                problem: R`Approximate $\log_9 0.6$.`,
                steps: [R`$\dfrac{\ln 0.6}{\ln 9} = \dfrac{-0.5108}{2.1972}$.`, R`$\approx -0.2325$.`],
              },
              trap: R`Dividing the other way ($\tfrac{\ln 9}{\ln 0.6} \approx -4.3013$). Every wrong choice is a different calculator slip.`,
            },
          ],
        },
        {
          title: 'The log rules',
          minutes: 25,
          goal: 'Expand, condense, and pull exponents out front.',
          topics: [
            {
              title: 'Expanding a logarithm', qs: [4], gens: ['expand'], lesson: 'exp-log',
              method: [
                R`Product inside: add logs. Quotient inside: subtract logs.`,
                R`Exponents come down in front as coefficients.`,
                R`Evaluate any pure number: $\log_2 \tfrac{1}{32} = -5$.`,
              ],
              example: {
                problem: R`Expand $\log_2\!\left(\tfrac{1}{32}p^3 q\right)$.`,
                steps: [
                  R`$\log_2 \tfrac{1}{32} + \log_2 p^3 + \log_2 q$.`,
                  R`$\log_2 \tfrac{1}{32} = \log_2 2^{-5} = -5$.`,
                  R`$-5 + 3\log_2 p + \log_2 q$.`,
                ],
              },
              trap: R`Multiplying the exponent into the number, as in $-15\log_2 p$.`,
            },
            {
              title: 'Power property with radicals', qs: [15], gens: ['power'], lesson: 'exp-log',
              method: [
                R`Rewrite the root as a fractional exponent: $\sqrt[n]{x^m} = x^{m/n}$.`,
                R`Bring the exponent down: $\ln x^{m/n} = \tfrac{m}{n}\ln x$.`,
              ],
              example: {
                problem: R`Simplify $\ln \sqrt[8]{x^9}$.`,
                steps: [R`$\sqrt[8]{x^9} = x^{9/8}$.`, R`$\tfrac{9}{8}\ln x$.`],
              },
              trap: R`Turning the root into a subtraction or a quotient of logs. A root is just a fractional power.`,
            },
            {
              title: 'Condensing to one logarithm', qs: [18], gens: ['condense'], lesson: 'exp-log',
              method: [
                R`Plus signs become multiplication inside one log; minus signs become division.`,
                R`Simplify the number inside, then evaluate the log if you can.`,
              ],
              example: {
                problem: R`Condense $\log_5 10 + \log_5 20 - \log_5 8$.`,
                steps: [R`$\log_5 \dfrac{10 \cdot 20}{8} = \log_5 25$.`, R`$25 = 5^2$, so the answer is $2$.`],
              },
              trap: R`Adding and subtracting the numbers themselves ($\log_5 22$). The rules multiply and divide.`,
            },
          ],
        },
        {
          title: 'Exponential and log graphs',
          minutes: 30,
          goal: 'Match equations to graphs and state domain and range.',
          topics: [
            {
              title: 'Graphing b^x', qs: [10], gens: ['expgraph'], lesson: 'exp-log',
              method: [
                R`Every $b^x$ passes through $(0, 1)$ with asymptote $y = 0$.`,
                R`$b > 1$ rises left to right; $0 < b < 1$ falls.`,
                R`Domain $(-\infty, \infty)$, range $(0, \infty)$.`,
              ],
              trap: R`A choice can have the right picture with domain and range swapped. Check both the graph and the text.`,
            },
            {
              title: 'Shifting e^x', qs: [16], gens: ['egraph'], lesson: 'exp-log',
              method: [
                R`$e^{x + h}$ shifts left $h$; $e^{x - h}$ shifts right $h$.`,
                R`$+ k$ outside shifts up $k$ and moves the asymptote to $y = k$.`,
                R`The range starts at the asymptote: $(k, \infty)$.`,
              ],
              trap: R`Reading $e^{x+1}$ as a shift up 1. A change in the exponent moves the graph sideways.`,
            },
            {
              title: 'Reflecting a^x', qs: [17], gens: ['reflectexp'], lesson: 'exp-log',
              method: [
                R`$a^{-x}$: reflect across the $y$-axis. Still positive, now falls to the right.`,
                R`$-a^x$: reflect across the $x$-axis. Range becomes $(-\infty, 0)$.`,
              ],
              trap: R`Mixing up the two reflections. A negative <em>in the exponent</em> flips left-right; a negative <em>in front</em> flips up-down.`,
            },
            {
              title: 'Shifting log graphs', qs: [11], gens: ['loggraph'], lesson: 'exp-log',
              method: [
                R`$\log_2 x$ has vertical asymptote $x = 0$ and passes through $(1, 0)$, rising to the right.`,
                R`$\log_2(x - h)$ moves the asymptote to $x = h$. $\ + k$ moves everything up $k$.`,
                R`The key point moves from $(1, 0)$ to $(h + 1, k)$.`,
              ],
              trap: R`Choosing a graph that falls to the right. Without a negative in front, a log graph always rises.`,
            },
            {
              title: 'Domain of a log', qs: [9], gens: ['logdomain'], lesson: 'exp-log',
              method: [
                R`The argument of a log must be strictly positive.`,
                R`For a quadratic argument, factor, find the zeros, and keep the intervals where it is positive.`,
                R`Strict inequality, so parentheses, never brackets.`,
              ],
              example: {
                problem: R`Domain of $\ln(x^2 + 3x - 18)$.`,
                steps: [R`$(x + 6)(x - 3) > 0$.`, R`Positive outside the zeros $-6$ and $3$.`, R`$(-\infty, -6) \cup (3, \infty)$.`],
              },
              trap: R`Using brackets, or flipping the signs of the zeros.`,
            },
          ],
        },
        {
          title: 'Solving exponential equations',
          minutes: 35,
          goal: 'Solve for a variable stuck in an exponent.',
          topics: [
            {
              title: 'Rewriting with the same base', qs: [8], gens: ['samebase'], lesson: 'exp-log',
              method: [
                R`Write both sides as powers of the same number. $\tfrac{1}{64} = 2^{-6}$ and $8 = 2^3$.`,
                R`Set the exponents equal and solve the linear equation.`,
              ],
              example: {
                problem: R`Solve $8^{4x - 4} = \left(\tfrac{1}{64}\right)^{x + 5}$.`,
                steps: [
                  R`$2^{3(4x - 4)} = 2^{-6(x + 5)}$.`,
                  R`$12x - 12 = -6x - 30$.`,
                  R`$18x = -18$, so $x = -1$.`,
                ],
              },
              trap: R`Forgetting the negative from the reciprocal $\tfrac{1}{64} = 2^{-6}$.`,
            },
            {
              title: 'Taking logs of both sides', qs: [5, 6], gens: ['solvecommon', 'solvenatural'], lesson: 'exp-log',
              method: [
                R`Isolate the exponential first (move any constants away).`,
                R`Take $\log$ or $\ln$ of both sides; the exponent comes down as a factor.`,
                R`With $x$ on both sides, gather the $x$ terms, factor out $x$, and divide.`,
              ],
              example: {
                problem: R`Solve $8^{4x + 5} = 5^{9x}$.`,
                steps: [
                  R`$(4x + 5)\ln 8 = 9x\ln 5$.`,
                  R`$5\ln 8 = 9x\ln 5 - 4x\ln 8 = x(9\ln 5 - 4\ln 8)$.`,
                  R`$x = \dfrac{5\ln 8}{9\ln 5 - 4\ln 8} \approx 1.6859$.`,
                ],
              },
              trap: R`Taking the log before isolating. In $10^{9x - 1} - 8000 = 110000$, add 8000 first to get $118{,}000$.`,
            },
            {
              title: 'Quadratic form', qs: [7], gens: ['quadexp'], lesson: 'exp-log',
              method: [
                R`Notice $e^{2x} = (e^x)^2$. Let $u = e^x$.`,
                R`Factor the quadratic in $u$.`,
                R`$e^x$ is always positive, so throw out any negative value of $u$.`,
              ],
              example: {
                problem: R`Solve $e^{2x} + 4e^x - 32 = 0$.`,
                steps: [R`$(u - 4)(u + 8) = 0$.`, R`$e^x = 4$ works; $e^x = -8$ is impossible.`, R`$\{\ln 4\};\ x \approx 1.3863$.`],
              },
              trap: R`Keeping $\ln(-8)$ or rewriting it as $-\ln 8$. Neither is valid.`,
            },
          ],
        },
        {
          title: 'Solving log equations and applications',
          minutes: 30,
          goal: 'Solve equations with logs and compare investments.',
          topics: [
            {
              title: 'Combining logs, then solving', qs: [12], gens: ['logsum'], lesson: 'exp-log',
              method: [
                R`Use the product rule to make one log on each side.`,
                R`Same base on both sides: set the arguments equal.`,
                R`Solve, then <strong>check</strong>: every log argument must be positive.`,
              ],
              example: {
                problem: R`Solve $\log_5(5p + 3) + \log_5 p = \log_5 14$.`,
                steps: [
                  R`$p(5p + 3) = 14$, so $5p^2 + 3p - 14 = 0$.`,
                  R`$(5p - 7)(p + 2) = 0$: $p = \tfrac{7}{5}$ or $p = -2$.`,
                  R`$\log_5(-2)$ is undefined, so $\left\{\tfrac{7}{5}\right\}$.`,
                ],
              },
              trap: R`Adding the arguments instead of multiplying them, which gives $\tfrac{11}{6}$.`,
            },
            {
              title: 'Isolating a log', qs: [13], gens: ['logsolve'], lesson: 'exp-log',
              method: [
                R`Undo the outside operations first: add, then divide, until the log is alone.`,
                R`Rewrite in exponential form and solve.`,
              ],
              example: {
                problem: R`Solve $2\log_4(5p - 8) - 3 = -1$.`,
                steps: [R`$2\log_4(5p - 8) = 2$, so $\log_4(5p - 8) = 1$.`, R`$5p - 8 = 4^1 = 4$.`, R`$p = \tfrac{12}{5}$.`],
              },
              trap: R`Subtracting the constant instead of adding it back.`,
            },
            {
              title: 'Simple vs. continuous interest', qs: [2], gens: ['interest'], lesson: 'exp-log',
              method: [
                R`Simple interest: $I = Prt$.`,
                R`Continuous: $A = Pe^{rt}$, so interest is $Pe^{rt} - P$.`,
                R`Write rates as decimals ($7\% = 0.07$) and compare the two interest amounts.`,
              ],
              example: {
                problem: R`8,000 dollars: 7.2% simple or 7% continuous, for 30 years.`,
                steps: [
                  R`Simple: $8000(0.072)(30) = 17{,}280$.`,
                  R`Continuous: $8000e^{2.1} - 8000 \approx 57{,}329$.`,
                  R`Continuous earns more.`,
                ],
              },
              trap: R`Comparing the continuous total $A$ to the simple interest $I$. Compare interest to interest.`,
            },
          ],
        },
        {
          title: 'Dress rehearsal',
          minutes: 30,
          goal: 'Take Blitz 3 under quiz conditions and close the gaps.',
          rehearsal: true,
          steps: [
            R`Take Blitz 3 start to finish without notes. Use a calculator for the decimal questions.`,
            R`Read the explanation for every question you missed, even lucky guesses.`,
            R`Go back to the session above that covers each miss and do two practice questions.`,
            R`Retake Blitz 3. Every attempt has new numbers. You are ready when you score 90 or more twice in a row.`,
          ],
        },
      ],
    },
  };

  /* ------------------------------------------------------------ view */
  function h(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  const qLabel = qs => (qs.length > 1 ? 'Questions ' + qs.join(' and ') : 'Question ' + qs[0]);

  /* api: { renderMath, lessonTitle(id), isDone(planId, i), setDone(planId, i, v), blitzRecord(id), onChange() } */
  function view(planId, api) {
    const plan = PLANS[planId];
    const art = h('article', { class: 'lesson prep' });
    art.appendChild(h('p', { class: 'crumb' }, '<a href="#/blitz">Blitz sessions</a>'));
    art.appendChild(h('h1', { tabindex: '-1' }, plan.title));
    art.appendChild(h('p', { class: 'lede' }, plan.lede));

    const total = plan.sessions.reduce((s, x) => s + x.minutes, 0);
    const overview = h('nav', { class: 'prep-overview', 'aria-label': 'Sessions in this plan' });
    const ol = h('ol');
    plan.sessions.forEach((s, i) => {
      ol.appendChild(h('li', { class: api.isDone(planId, i) ? 'is-done' : '' },
        `<a href="#/prep/${planId}" data-jump="${i}">${s.title}</a><span>${s.minutes} min</span>`));
    });
    overview.appendChild(ol);
    const done = plan.sessions.filter((_, i) => api.isDone(planId, i)).length;
    overview.appendChild(h('p', { class: 'prep-total' }, `${done} of ${plan.sessions.length} sessions done, about ${Math.round(total / 60 * 10) / 10} hours in all`));
    overview.addEventListener('click', e => {
      const a = e.target.closest('[data-jump]');
      if (!a) return;
      e.preventDefault();
      const t = document.getElementById('session-' + a.dataset.jump);
      if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); t.querySelector('h2').focus({ preventScroll: true }); }
    });
    art.appendChild(overview);

    plan.sessions.forEach((s, i) => {
      const sec = h('section', { class: 'prep-session' + (api.isDone(planId, i) ? ' is-done' : ''), id: 'session-' + i });
      const head = h('header', { class: 'prep-head' });
      head.innerHTML = `<p class="prep-num">Session ${i + 1}</p><h2 tabindex="-1">${s.title}</h2><p class="prep-goal">${s.goal} <span>About ${s.minutes} minutes.</span></p>`;
      sec.appendChild(head);

      if (s.rehearsal) {
        const steps = h('ol', { class: 'checklist' }, s.steps.map(t => `<li>${t}</li>`).join(''));
        sec.appendChild(steps);
        const rec = api.blitzRecord(plan.blitz);
        if (rec) sec.appendChild(h('p', { class: 'muted' }, `Your best Blitz ${plan.blitz} score so far: ${Math.round(rec.best * 10) / 10} of 100.`));
        sec.appendChild(h('a', { class: 'btn', href: `#/blitz/${plan.blitz}` }, `Take Blitz ${plan.blitz}`));
      } else {
        s.topics.forEach(t => {
          const card = h('div', { class: 'prep-topic' });
          card.appendChild(h('h3', null, `${t.title}<span class="prep-qs">${qLabel(t.qs)}</span>`));
          card.appendChild(h('ol', { class: 'checklist' }, t.method.map(m => `<li>${m}</li>`).join('')));
          if (t.example) {
            const ex = h('div', { class: 'prep-example' });
            ex.innerHTML = `<p class="problem"><strong>Example.</strong> ${t.example.problem}</p><ol class="steps">${t.example.steps.map(x => `<li>${x}</li>`).join('')}</ol>`;
            card.appendChild(ex);
          }
          card.appendChild(h('p', { class: 'warn' }, `<strong>Watch out:</strong> ${t.trap}`));
          const row = h('div', { class: 'prep-actions' });
          const btn = h('button', { type: 'button', class: 'btn-small' }, 'Practice a question');
          row.appendChild(btn);
          row.appendChild(h('a', { class: 'prep-link', href: `#/lesson/${t.lesson}` }, `Full lesson: ${api.lessonTitle(t.lesson)}`));
          card.appendChild(row);
          const slot = h('div', { class: 'prep-practice' });
          card.appendChild(slot);
          btn.addEventListener('click', () => {
            btn.remove();
            Blitz.practice(slot, t.gens, api.renderMath);
          });
          sec.appendChild(card);
        });
      }

      const mark = h('button', { type: 'button', class: 'btn-quiet prep-mark', 'aria-pressed': api.isDone(planId, i) ? 'true' : 'false' },
        api.isDone(planId, i) ? 'Session done. Mark as not done' : 'Mark session done');
      mark.addEventListener('click', () => {
        const now = !api.isDone(planId, i);
        api.setDone(planId, i, now);
        sec.classList.toggle('is-done', now);
        mark.setAttribute('aria-pressed', now ? 'true' : 'false');
        mark.textContent = now ? 'Session done. Mark as not done' : 'Mark session done';
        ol.children[i].classList.toggle('is-done', now);
        const d = plan.sessions.filter((_, k) => api.isDone(planId, k)).length;
        overview.querySelector('.prep-total').textContent = `${d} of ${plan.sessions.length} sessions done, about ${Math.round(total / 60 * 10) / 10} hours in all`;
        api.onChange();
      });
      sec.appendChild(mark);
      art.appendChild(sec);
    });
    return art;
  }

  window.Prep = {
    plans: PLANS,
    has: id => !!PLANS[id],
    view,
    count: id => PLANS[id].sessions.length,
  };
})();
