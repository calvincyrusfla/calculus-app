/* Course content. Math is written in LaTeX between $...$ (inline) or $$...$$ (display)
   and typeset by KaTeX. String.raw keeps backslashes intact. */
(function () {
  const R = String.raw;

  const parts = [
    { id: 'algebra', title: 'Algebra foundations', blurb: 'The rules every later topic leans on: exponents, factoring, fractions with variables, and solving.' },
    { id: 'functions', title: 'Functions', blurb: 'What a function is, how graphs move, and the big families: polynomial, rational, exponential, logarithmic.' },
    { id: 'trig', title: 'Trigonometry', blurb: 'Angles, the unit circle, wave graphs, identities, equations, and solving triangles.' },
  ];

  const lessons = [
    /* ------------------------------------------------------------------ 1 */
    {
      id: 'exponents', part: 'algebra', minutes: 15,
      title: 'Exponents and radicals',
      summary: 'Simplify any expression built from powers and roots by applying a short list of rules.',
      body: R`
        <h3>The exponent rules</h3>
        <p>Every exponent problem in pre-calculus is solved with these seven rules. Learn them as a set; most mistakes come from mixing up the first three.</p>
        <div class="rules">
          <div>$a^m \cdot a^n = a^{m+n}$<span>Same base, multiply: add exponents</span></div>
          <div>$\dfrac{a^m}{a^n} = a^{m-n}$<span>Same base, divide: subtract exponents</span></div>
          <div>$(a^m)^n = a^{mn}$<span>Power of a power: multiply exponents</span></div>
          <div>$(ab)^n = a^n b^n$<span>Exponent distributes over a product</span></div>
          <div>$a^0 = 1 \quad (a \ne 0)$<span>Anything nonzero to the zero power</span></div>
          <div>$a^{-n} = \dfrac{1}{a^n}$<span>A negative exponent means reciprocal</span></div>
          <div>$a^{m/n} = \left(\sqrt[n]{a}\right)^m$<span>Fractional exponent: root, then power</span></div>
        </div>
        <p class="warn">Exponents do <strong>not</strong> distribute over addition: $(a+b)^2 \ne a^2 + b^2$. It equals $a^2 + 2ab + b^2$.</p>

        <h3>Simplifying radicals</h3>
        <p>A square root is simplified when no perfect-square factor is left under the radical. Pull out the largest perfect square: $\sqrt{72} = \sqrt{36 \cdot 2} = 6\sqrt{2}$.</p>
        <p>Only <em>like radicals</em> combine: $3\sqrt{2} + 5\sqrt{2} = 8\sqrt{2}$, but $\sqrt{2} + \sqrt{3}$ stays as it is.</p>

        <h3>Rationalizing the denominator</h3>
        <p>To remove a root from a denominator, multiply top and bottom by what clears it:</p>
        <p>$$\frac{3}{\sqrt{5}} \cdot \frac{\sqrt{5}}{\sqrt{5}} = \frac{3\sqrt{5}}{5} \qquad \frac{2}{3-\sqrt{2}} \cdot \frac{3+\sqrt{2}}{3+\sqrt{2}} = \frac{2(3+\sqrt{2})}{7}$$</p>
        <p>The second uses the <em>conjugate</em> $3+\sqrt{2}$, because $(3-\sqrt{2})(3+\sqrt{2}) = 9 - 2 = 7$.</p>
      `,
      examples: [
        {
          title: 'Simplify with several rules at once',
          problem: R`Simplify $\dfrac{(2x^3y^{-2})^3}{4x^{-1}y}$ and write it with positive exponents.`,
          steps: [
            R`Apply the outer power to every factor: $(2x^3y^{-2})^3 = 8x^9y^{-6}$.`,
            R`Divide the coefficients: $8 \div 4 = 2$.`,
            R`Subtract exponents on $x$: $x^{9-(-1)} = x^{10}$.`,
            R`Subtract exponents on $y$: $y^{-6-1} = y^{-7}$.`,
            R`Move the negative exponent down: $\dfrac{2x^{10}}{y^7}$.`,
          ],
        },
        {
          title: 'Evaluate a fractional exponent',
          problem: R`Evaluate $27^{-2/3}$.`,
          steps: [
            R`Handle the negative sign first: $27^{-2/3} = \dfrac{1}{27^{2/3}}$.`,
            R`Take the cube root: $\sqrt[3]{27} = 3$.`,
            R`Square it: $3^2 = 9$, so the answer is $\dfrac{1}{9}$.`,
          ],
        },
      ],
      takeaways: [
        R`Multiply same base: add exponents. Divide: subtract. Power of a power: multiply.`,
        R`$a^{-n} = 1/a^n$ and $a^{m/n} = (\sqrt[n]{a})^m$.`,
        R`Rationalize with $\sqrt{b}/\sqrt{b}$ or with the conjugate.`,
      ],
      quiz: [
        { q: R`Evaluate $16^{3/4}$.`, choices: [R`$8$`, R`$12$`, R`$64$`, R`$6$`], answer: 0, why: R`$\sqrt[4]{16} = 2$, then $2^3 = 8$.` },
        { q: R`Simplify $\sqrt{50} + \sqrt{18}$.`, choices: [R`$8\sqrt{2}$`, R`$\sqrt{68}$`, R`$2\sqrt{17}$`, R`$15\sqrt{2}$`], answer: 0, why: R`$\sqrt{50} = 5\sqrt{2}$ and $\sqrt{18} = 3\sqrt{2}$, so the sum is $8\sqrt{2}$.` },
        { q: R`Simplify $\dfrac{x^{-3}\cdot x^{5}}{x^{-2}}$.`, choices: [R`$x^{4}$`, R`$x^{0}$`, R`$x^{6}$`, R`$x^{-4}$`], answer: 0, why: R`Numerator: $x^{-3+5} = x^2$. Divide: $x^{2-(-2)} = x^4$.` },
      ],
    },

    /* ------------------------------------------------------------------ 2 */
    {
      id: 'factoring', part: 'algebra', minutes: 20,
      title: 'Polynomials and factoring',
      summary: 'Rewrite polynomials as products so you can solve equations and simplify fractions.',
      body: R`
        <h3>Factor in this order</h3>
        <p>Run every polynomial through the same checklist. Stopping early is the most common error.</p>
        <ol class="checklist">
          <li><strong>Greatest common factor.</strong> Always first: $6x^3 - 9x^2 = 3x^2(2x - 3)$.</li>
          <li><strong>Count the terms.</strong> Two terms: look for a special pattern. Three terms: trinomial methods. Four terms: try grouping.</li>
          <li><strong>Check each factor again.</strong> Keep going until nothing factors further.</li>
        </ol>

        <h3>Special patterns</h3>
        <div class="rules">
          <div>$a^2 - b^2 = (a-b)(a+b)$<span>Difference of squares</span></div>
          <div>$a^3 - b^3 = (a-b)(a^2+ab+b^2)$<span>Difference of cubes</span></div>
          <div>$a^3 + b^3 = (a+b)(a^2-ab+b^2)$<span>Sum of cubes</span></div>
          <div>$a^2 \pm 2ab + b^2 = (a \pm b)^2$<span>Perfect square trinomial</span></div>
        </div>
        <p class="warn">A <em>sum</em> of squares like $x^2 + 9$ does not factor over the real numbers.</p>

        <h3>Trinomials $ax^2 + bx + c$</h3>
        <p>When $a = 1$, find two numbers that multiply to $c$ and add to $b$: $x^2 - 9x + 20 = (x-4)(x-5)$.</p>
        <p>When $a \ne 1$, use the <em>ac method</em>: find two numbers that multiply to $ac$ and add to $b$, split the middle term, then factor by grouping. The example below walks through it.</p>
      `,
      examples: [
        {
          title: 'The ac method',
          problem: R`Factor $6x^2 + x - 2$.`,
          steps: [
            R`Compute $ac = 6 \cdot (-2) = -12$.`,
            R`Find two numbers with product $-12$ and sum $1$: they are $4$ and $-3$.`,
            R`Split the middle term: $6x^2 + 4x - 3x - 2$.`,
            R`Group: $2x(3x + 2) - 1(3x + 2)$.`,
            R`Factor out the common binomial: $(2x - 1)(3x + 2)$.`,
          ],
        },
        {
          title: 'Factor completely',
          problem: R`Factor $2x^4 - 32$.`,
          steps: [
            R`Take out the GCF: $2(x^4 - 16)$.`,
            R`Difference of squares: $x^4 - 16 = (x^2 - 4)(x^2 + 4)$.`,
            R`$x^2 - 4$ is another difference of squares: $(x-2)(x+2)$.`,
            R`$x^2 + 4$ is a sum of squares and stops here. Answer: $2(x-2)(x+2)(x^2+4)$.`,
          ],
        },
      ],
      takeaways: [
        R`Factor out the GCF first, every time.`,
        R`$a^2-b^2=(a-b)(a+b)$; $a^3 \pm b^3 = (a \pm b)(a^2 \mp ab + b^2)$.`,
        R`For $ax^2+bx+c$, split $b$ into two numbers whose product is $ac$, then group.`,
      ],
      quiz: [
        { q: R`Factor $x^3 - 8$.`, choices: [R`$(x-2)(x^2+2x+4)$`, R`$(x-2)^3$`, R`$(x-2)(x^2-2x+4)$`, R`$(x+2)(x^2-2x+4)$`], answer: 0, why: R`Difference of cubes with $a = x$, $b = 2$: $(a-b)(a^2+ab+b^2)$.` },
        { q: R`Factor $x^2 - 9x + 20$.`, choices: [R`$(x-4)(x-5)$`, R`$(x+4)(x+5)$`, R`$(x-2)(x-10)$`, R`$(x-4)(x+5)$`], answer: 0, why: R`$-4$ and $-5$ multiply to $20$ and add to $-9$.` },
        { q: R`Factor $4x^2 - 25$.`, choices: [R`$(2x-5)(2x+5)$`, R`$(2x-5)^2$`, R`$(4x-5)(x+5)$`, R`It does not factor`], answer: 0, why: R`Difference of squares: $(2x)^2 - 5^2$.` },
      ],
    },

    /* ------------------------------------------------------------------ 3 */
    {
      id: 'rational-expressions', part: 'algebra', minutes: 15,
      title: 'Rational expressions',
      summary: 'Work with fractions that have polynomials on top and bottom, without dividing by zero.',
      body: R`
        <h3>Restrictions come first</h3>
        <p>A rational expression is undefined wherever its denominator is zero. Find those values <em>before</em> you simplify, because simplifying can hide them. For $\dfrac{x+3}{x^2-16}$, the restrictions are $x \ne 4$ and $x \ne -4$.</p>

        <h3>Simplify by cancelling factors</h3>
        <p>Factor top and bottom completely, then cancel common <em>factors</em>, never individual terms.</p>
        <p class="warn">$\dfrac{x+2}{x} \ne 2$. The $x$ is a term in the numerator, not a factor, so nothing cancels.</p>

        <h3>The four operations</h3>
        <div class="rules">
          <div>$\dfrac{A}{B}\cdot\dfrac{C}{D} = \dfrac{AC}{BD}$<span>Multiply: factor, cancel, then multiply</span></div>
          <div>$\dfrac{A}{B}\div\dfrac{C}{D} = \dfrac{A}{B}\cdot\dfrac{D}{C}$<span>Divide: flip the second fraction</span></div>
          <div>$\dfrac{A}{D}+\dfrac{C}{D} = \dfrac{A+C}{D}$<span>Add or subtract: get a common denominator first</span></div>
        </div>
        <p>For the least common denominator (LCD), factor every denominator and take each distinct factor the greatest number of times it appears.</p>
        <p>A <em>complex fraction</em> (fractions inside a fraction) is cleared by multiplying its top and bottom by the LCD of all the small fractions.</p>
      `,
      examples: [
        {
          title: 'Simplify and state restrictions',
          problem: R`Simplify $\dfrac{x^2-4}{x^2+x-6}$.`,
          steps: [
            R`Factor the top: $x^2 - 4 = (x-2)(x+2)$.`,
            R`Factor the bottom: $x^2 + x - 6 = (x+3)(x-2)$.`,
            R`Restrictions from the original bottom: $x \ne 2$, $x \ne -3$.`,
            R`Cancel $(x-2)$: $\dfrac{x+2}{x+3}$, with $x \ne 2, -3$.`,
          ],
        },
        {
          title: 'Add with an LCD',
          problem: R`Combine $\dfrac{1}{x} + \dfrac{2}{x+1}$.`,
          steps: [
            R`The LCD is $x(x+1)$.`,
            R`Rewrite each fraction: $\dfrac{x+1}{x(x+1)} + \dfrac{2x}{x(x+1)}$.`,
            R`Add numerators: $\dfrac{3x+1}{x(x+1)}$.`,
          ],
        },
      ],
      takeaways: [
        R`Find restrictions (denominator $=0$) before simplifying.`,
        R`Cancel factors only, never terms.`,
        R`Add and subtract over the LCD; divide by multiplying by the reciprocal.`,
      ],
      quiz: [
        { q: R`Simplify $\dfrac{x^2-1}{x+1}$.`, choices: [R`$x-1$, with $x \ne -1$`, R`$x$`, R`$x^2$`, R`$x+1$, with $x \ne 1$`], answer: 0, why: R`$x^2-1 = (x-1)(x+1)$; cancel $(x+1)$ and keep the restriction $x \ne -1$.` },
        { q: R`Where is $\dfrac{x+3}{x^2-16}$ undefined?`, choices: [R`$x = 4$ and $x = -4$`, R`$x = -3$`, R`$x = 16$`, R`$x = 4$ only`], answer: 0, why: R`$x^2 - 16 = 0$ when $x = \pm 4$.` },
        { q: R`Combine $\dfrac{2}{x} - \dfrac{1}{x-1}$.`, choices: [R`$\dfrac{x-2}{x(x-1)}$`, R`$\dfrac{1}{x(x-1)}$`, R`$\dfrac{1}{-1}$`, R`$\dfrac{x}{x(x-1)}$`], answer: 0, why: R`Over $x(x-1)$: $\dfrac{2(x-1) - x}{x(x-1)} = \dfrac{x-2}{x(x-1)}$.` },
      ],
    },

    /* ------------------------------------------------------------------ 4 */
    {
      id: 'equations', part: 'algebra', minutes: 25,
      title: 'Equations and inequalities',
      summary: 'Solve linear, quadratic, absolute value, and polynomial equations and inequalities.',
      body: R`
        <h3>Quadratic equations</h3>
        <p>Get everything on one side so the equation reads $ax^2 + bx + c = 0$. Then factor if you can; if not, use the quadratic formula:</p>
        <p>$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$</p>
        <p>The <strong>discriminant</strong> $D = b^2 - 4ac$ tells you what kind of solutions to expect before you solve:</p>
        <div class="rules">
          <div>$D > 0$<span>Two different real solutions</span></div>
          <div>$D = 0$<span>One repeated real solution</span></div>
          <div>$D < 0$<span>No real solutions (two complex ones)</span></div>
        </div>
        <p><em>Completing the square</em> rewrites $x^2 + bx$ as $\left(x + \tfrac{b}{2}\right)^2 - \left(\tfrac{b}{2}\right)^2$. You will use it again to find the vertex of a parabola and the center of a circle.</p>

        <h3>Inequalities</h3>
        <p>Solve like an equation, with one extra rule: multiplying or dividing both sides by a negative number <strong>flips</strong> the inequality sign.</p>
        <p>For polynomial and rational inequalities, use a <em>sign chart</em>: find where the expression is zero or undefined, mark those points on a number line, and test one value in each interval.</p>

        <h3>Absolute value</h3>
        <div class="rules">
          <div>$|u| = c \iff u = c \text{ or } u = -c$<span>Two cases (no solution if $c < 0$)</span></div>
          <div>$|u| < c \iff -c < u < c$<span>"Less than" gives one interval between</span></div>
          <div>$|u| > c \iff u < -c \text{ or } u > c$<span>"Greater than" gives two rays outward</span></div>
        </div>
      `,
      examples: [
        {
          title: 'Quadratic inequality with a sign chart',
          problem: R`Solve $x^2 - 4x - 5 \le 0$.`,
          steps: [
            R`Factor: $(x - 5)(x + 1) \le 0$.`,
            R`Zeros at $x = -1$ and $x = 5$ split the line into three intervals.`,
            R`Test $x = 0$: $(-5)(1) = -5 \le 0$, so the middle interval works. Testing $x=-2$ and $x=6$ gives positive values.`,
            R`Include the endpoints because of "$\le$". Answer: $[-1, 5]$.`,
          ],
        },
        {
          title: 'Absolute value inequality',
          problem: R`Solve $|2x - 3| > 5$.`,
          steps: [
            R`"Greater than" splits into two cases: $2x - 3 > 5$ or $2x - 3 < -5$.`,
            R`First case: $2x > 8$, so $x > 4$.`,
            R`Second case: $2x < -2$, so $x < -1$.`,
            R`Answer: $(-\infty, -1) \cup (4, \infty)$.`,
          ],
        },
      ],
      takeaways: [
        R`Quadratic formula: $x = \dfrac{-b \pm \sqrt{b^2-4ac}}{2a}$; the discriminant $b^2-4ac$ counts real solutions.`,
        R`Flip the inequality when multiplying or dividing by a negative.`,
        R`$|u| \lt c$ means $-c \lt u \lt c$; $|u| \gt c$ means $u \lt -c$ or $u \gt c$.`,
      ],
      quiz: [
        { q: R`How many real solutions does $2x^2 + 3x + 5 = 0$ have?`, choices: [R`None`, R`One`, R`Two`, R`Infinitely many`], answer: 0, why: R`$D = 9 - 40 = -31 < 0$, so there are no real solutions.` },
        { q: R`Solve $-3x + 7 > 1$.`, choices: [R`$x < 2$`, R`$x > 2$`, R`$x < -2$`, R`$x > -2$`], answer: 0, why: R`$-3x > -6$. Dividing by $-3$ flips the sign: $x < 2$.` },
        { q: R`Solve $x^2 = 6x - 9$.`, choices: [R`$x = 3$`, R`$x = \pm 3$`, R`$x = 9$`, R`No real solution`], answer: 0, why: R`$x^2 - 6x + 9 = (x-3)^2 = 0$, so $x = 3$ (repeated).` },
      ],
    },

    /* ------------------------------------------------------------------ 5 */
    {
      id: 'functions', part: 'functions', minutes: 20,
      title: 'Functions, domain, and range',
      summary: 'Read function notation, find where a function is defined, and compute a difference quotient.',
      body: R`
        <h3>What makes a function</h3>
        <p>A function assigns <strong>exactly one</strong> output to each input. On a graph, that is the <em>vertical line test</em>: if any vertical line hits the graph twice, it is not a function.</p>
        <p>In $f(x) = x^2 - 3x$, the $x$ is a placeholder. Whatever goes inside the parentheses replaces every $x$: $f(a+1) = (a+1)^2 - 3(a+1)$.</p>

        <h3>Finding the domain</h3>
        <p>Start with all real numbers, then remove anything that breaks one of these three rules:</p>
        <div class="rules">
          <div>$\dfrac{\ \cdot\ }{\text{denominator}}$<span>Denominator cannot be $0$</span></div>
          <div>$\sqrt{\text{radicand}}$<span>Even root: radicand must be $\ge 0$</span></div>
          <div>$\log(\text{argument})$<span>Log: argument must be $> 0$</span></div>
        </div>
        <p>Write the answer in interval notation. Parentheses exclude an endpoint; brackets include it. For $\sqrt{5-x}$: $5 - x \ge 0$ gives $(-\infty, 5]$.</p>

        <h3>The difference quotient</h3>
        <p>$$\frac{f(x+h) - f(x)}{h}$$</p>
        <p>This is the slope between two points on the graph a distance $h$ apart. It is the exact expression calculus starts from, so practice expanding it cleanly.</p>

        <h3>Even and odd</h3>
        <p><strong>Even:</strong> $f(-x) = f(x)$, symmetric about the $y$-axis (like $x^2$). <strong>Odd:</strong> $f(-x) = -f(x)$, symmetric about the origin (like $x^3$). Most functions are neither.</p>
      `,
      examples: [
        {
          title: 'Difference quotient',
          problem: R`For $f(x) = x^2 - 3x$, simplify $\dfrac{f(x+h) - f(x)}{h}$.`,
          steps: [
            R`Compute $f(x+h) = (x+h)^2 - 3(x+h) = x^2 + 2xh + h^2 - 3x - 3h$.`,
            R`Subtract $f(x)$: the $x^2$ and $-3x$ cancel, leaving $2xh + h^2 - 3h$.`,
            R`Factor out $h$ and divide: $\dfrac{h(2x + h - 3)}{h} = 2x + h - 3$.`,
          ],
        },
        {
          title: 'Domain with two restrictions',
          problem: R`Find the domain of $g(x) = \dfrac{\sqrt{x+2}}{x-3}$.`,
          steps: [
            R`Square root: $x + 2 \ge 0$, so $x \ge -2$.`,
            R`Denominator: $x \ne 3$.`,
            R`Combine: $[-2, 3) \cup (3, \infty)$.`,
          ],
        },
      ],
      takeaways: [
        R`Domain: no zero denominators, no negative even-root radicands, no non-positive log arguments.`,
        R`Difference quotient: $\dfrac{f(x+h)-f(x)}{h}$.`,
        R`Even: $f(-x)=f(x)$. Odd: $f(-x)=-f(x)$.`,
      ],
      quiz: [
        { q: R`What is the domain of $f(x) = \sqrt{5 - x}$?`, choices: [R`$(-\infty, 5]$`, R`$[5, \infty)$`, R`$(-\infty, 5)$`, R`All real numbers`], answer: 0, why: R`$5 - x \ge 0 \Rightarrow x \le 5$.` },
        { q: R`If $f(x) = 2x^2 - 1$, what is $f(-3)$?`, choices: [R`$17$`, R`$-19$`, R`$35$`, R`$-17$`], answer: 0, why: R`$2(9) - 1 = 17$. Squaring makes $-3$ positive.` },
        { q: R`Which function is odd?`, choices: [R`$x^3 - x$`, R`$x^2 + 1$`, R`$|x|$`, R`$x^3 + 1$`], answer: 0, why: R`$(-x)^3 - (-x) = -x^3 + x = -(x^3 - x)$.` },
      ],
    },

    /* ------------------------------------------------------------------ 6 */
    {
      id: 'transformations', part: 'functions', minutes: 15,
      title: 'Transformations of graphs',
      summary: 'Shift, stretch, and reflect a parent graph by reading four numbers in its equation.',
      body: R`
        <h3>One equation, four controls</h3>
        <p>Once you know a few parent graphs ($x^2$, $|x|$, $\sqrt{x}$, $x^3$), you can sketch hundreds of others from this form:</p>
        <p>$$y = a\,f\big(b(x - h)\big) + k$$</p>
        <div class="rules">
          <div>$h$<span>Horizontal shift: right if $h > 0$. Note the minus sign: $(x+2)$ means $h = -2$, left 2.</span></div>
          <div>$k$<span>Vertical shift: up if $k > 0$</span></div>
          <div>$a$<span>Vertical stretch by $|a|$; reflect over the $x$-axis if $a < 0$</span></div>
          <div>$b$<span>Horizontal compression by $|b|$ (a stretch if $|b| < 1$); reflect over the $y$-axis if $b < 0$</span></div>
        </div>
        <p class="tip">Changes <em>inside</em> the function act on $x$ and do the opposite of what they look like. Changes <em>outside</em> act on $y$ and do what they look like.</p>
        <p>Move the sliders below and watch the parent graph (dashed) become the transformed graph (solid).</p>
      `,
      interactive: { type: 'transform' },
      examples: [
        {
          title: 'Read the transformations',
          problem: R`Describe $y = -2(x+3)^2 + 1$ and give its vertex.`,
          steps: [
            R`Parent graph: $y = x^2$.`,
            R`$(x + 3)$ means $h = -3$: shift left 3.`,
            R`$a = -2$: stretch vertically by 2 and reflect over the $x$-axis (opens down).`,
            R`$k = 1$: shift up 1. The vertex moves from $(0,0)$ to $(-3, 1)$.`,
          ],
        },
      ],
      takeaways: [
        R`$y = a f(b(x-h)) + k$: $h$ right, $k$ up, $a$ vertical stretch/flip, $b$ horizontal squeeze/flip.`,
        R`Inside changes do the opposite of what they look like.`,
      ],
      quiz: [
        { q: R`What is the vertex of $y = (x + 2)^2 - 3$?`, choices: [R`$(-2, -3)$`, R`$(2, -3)$`, R`$(-2, 3)$`, R`$(2, 3)$`], answer: 0, why: R`$x + 2$ shifts left 2; $-3$ shifts down 3.` },
        { q: R`How is $y = -|x|$ related to $y = |x|$?`, choices: [R`Reflected over the $x$-axis`, R`Reflected over the $y$-axis`, R`Shifted down 1`, R`It is the same graph`], answer: 0, why: R`A negative outside the function flips every $y$-value.` },
        { q: R`How does $y = \sqrt{x - 4}$ compare to $y = \sqrt{x}$?`, choices: [R`Shifted right 4`, R`Shifted left 4`, R`Shifted down 4`, R`Shifted up 4`], answer: 0, why: R`$x - 4$ inside means $h = 4$: right 4.` },
      ],
    },

    /* ------------------------------------------------------------------ 7 */
    {
      id: 'composition', part: 'functions', minutes: 15,
      title: 'Composition and inverses',
      summary: 'Chain functions together, and undo a function by finding its inverse.',
      body: R`
        <h3>Composition</h3>
        <p>$(f \circ g)(x) = f\big(g(x)\big)$: apply $g$ first, then feed the result into $f$. Order matters; usually $f(g(x)) \ne g(f(x))$.</p>
        <p>The domain of $f \circ g$ is every $x$ in the domain of $g$ whose output $g(x)$ is in the domain of $f$.</p>

        <h3>Inverse functions</h3>
        <p>An inverse $f^{-1}$ undoes $f$: if $f(2) = 7$, then $f^{-1}(7) = 2$. Only <strong>one-to-one</strong> functions have inverses, which you can check with the <em>horizontal line test</em>.</p>
        <p class="warn">$f^{-1}(x)$ is not $\dfrac{1}{f(x)}$. The $-1$ is notation for "inverse", not an exponent.</p>
        <ol class="checklist">
          <li>Write $y = f(x)$.</li>
          <li>Swap $x$ and $y$.</li>
          <li>Solve for $y$. That $y$ is $f^{-1}(x)$.</li>
          <li>Check: $f\big(f^{-1}(x)\big) = x$.</li>
        </ol>
        <p>The graph of $f^{-1}$ is the graph of $f$ reflected over the line $y = x$, and the domain and range trade places.</p>
      `,
      examples: [
        {
          title: 'Find an inverse',
          problem: R`Find the inverse of $f(x) = \dfrac{2x + 1}{x - 3}$.`,
          steps: [
            R`Swap variables: $x = \dfrac{2y + 1}{y - 3}$.`,
            R`Clear the fraction: $xy - 3x = 2y + 1$.`,
            R`Collect $y$ terms on one side: $xy - 2y = 3x + 1$.`,
            R`Factor out $y$ and divide: $f^{-1}(x) = \dfrac{3x + 1}{x - 2}$.`,
          ],
        },
        {
          title: 'Evaluate a composition',
          problem: R`With $f(x) = x^2$ and $g(x) = x + 1$, find $(f \circ g)(x)$ and $(g \circ f)(x)$.`,
          steps: [
            R`$(f \circ g)(x) = f(x + 1) = (x+1)^2 = x^2 + 2x + 1$.`,
            R`$(g \circ f)(x) = g(x^2) = x^2 + 1$.`,
            R`They are different, which is why order matters.`,
          ],
        },
      ],
      takeaways: [
        R`$(f \circ g)(x) = f(g(x))$: inside function first.`,
        R`Inverse: swap $x$ and $y$, then solve for $y$.`,
        R`$f^{-1}$ reflects $f$ over $y = x$.`,
      ],
      quiz: [
        { q: R`If $f(x) = x^2$ and $g(x) = x + 1$, what is $f(g(2))$?`, choices: [R`$9$`, R`$5$`, R`$4$`, R`$6$`], answer: 0, why: R`$g(2) = 3$, then $f(3) = 9$.` },
        { q: R`What is the inverse of $f(x) = 3x - 6$?`, choices: [R`$\dfrac{x + 6}{3}$`, R`$\dfrac{1}{3x - 6}$`, R`$3x + 6$`, R`$\dfrac{x}{3} - 6$`], answer: 0, why: R`$x = 3y - 6 \Rightarrow y = \dfrac{x+6}{3}$.` },
        { q: R`The graph of $f^{-1}$ is the graph of $f$ reflected over which line?`, choices: [R`$y = x$`, R`The $x$-axis`, R`The $y$-axis`, R`$y = -x$`], answer: 0, why: R`Swapping $x$ and $y$ is a reflection over $y = x$.` },
      ],
    },

    /* ------------------------------------------------------------------ 8 */
    {
      id: 'polynomial-rational', part: 'functions', minutes: 25,
      title: 'Polynomial and rational functions',
      summary: 'Predict the shape of a graph from its zeros, end behavior, and asymptotes.',
      body: R`
        <h3>Polynomials</h3>
        <p><strong>End behavior</strong> depends only on the leading term $a_n x^n$. Even degree: both ends go the same way (up if $a_n > 0$). Odd degree: the ends go opposite ways (rising to the right if $a_n > 0$).</p>
        <p><strong>Zeros and multiplicity.</strong> If $(x - c)^m$ is a factor, the graph meets the $x$-axis at $c$. Odd $m$: the graph crosses. Even $m$: it touches and turns back.</p>
        <p>To find zeros of higher-degree polynomials:</p>
        <div class="rules">
          <div>Rational root theorem<span>Any rational zero is $\pm\dfrac{\text{factor of constant}}{\text{factor of leading coefficient}}$</span></div>
          <div>Remainder theorem<span>Dividing by $(x - c)$ leaves remainder $f(c)$; remainder $0$ means $c$ is a zero</span></div>
          <div>Synthetic division<span>A fast way to divide by $(x - c)$ and get the smaller polynomial that remains</span></div>
        </div>

        <h3>Rational functions $\dfrac{p(x)}{q(x)}$</h3>
        <ol class="checklist">
          <li><strong>Factor and cancel.</strong> A factor that cancels makes a <em>hole</em>.</li>
          <li><strong>Vertical asymptotes</strong> are the zeros of the denominator that remain.</li>
          <li><strong>Horizontal asymptote</strong>: compare degrees. Top smaller: $y = 0$. Equal: $y = \dfrac{\text{leading coefficient of top}}{\text{leading coefficient of bottom}}$. Top larger by one: a slant asymptote (found by long division).</li>
        </ol>
        <p>The graph below shows the worked example: a hole at $x = 2$, a vertical asymptote at $x = -1$, and a horizontal asymptote at $y = 2$.</p>
      `,
      interactive: { type: 'rational' },
      examples: [
        {
          title: 'Analyze a rational function',
          problem: R`Find holes and asymptotes of $f(x) = \dfrac{2x^2 - 8}{x^2 - x - 2}$.`,
          steps: [
            R`Factor: $\dfrac{2(x-2)(x+2)}{(x-2)(x+1)}$.`,
            R`$(x - 2)$ cancels: hole at $x = 2$. The reduced form $\dfrac{2(x+2)}{x+1}$ gives $y = \dfrac{8}{3}$ there, so the hole is at $\left(2, \tfrac{8}{3}\right)$.`,
            R`Remaining denominator zero: vertical asymptote $x = -1$.`,
            R`Degrees are equal: horizontal asymptote $y = \dfrac{2}{1} = 2$.`,
          ],
        },
      ],
      takeaways: [
        R`End behavior follows the leading term.`,
        R`Odd multiplicity crosses; even multiplicity touches.`,
        R`Rational: cancelled factor $\to$ hole; leftover denominator zero $\to$ vertical asymptote; compare degrees for the horizontal one.`,
      ],
      quiz: [
        { q: R`For $f(x) = -2x^5 + 4x^2 - 1$, what happens as $x \to \infty$?`, choices: [R`$f(x) \to -\infty$`, R`$f(x) \to \infty$`, R`$f(x) \to 0$`, R`$f(x) \to -2$`], answer: 0, why: R`The leading term $-2x^5$ becomes very negative for large $x$.` },
        { q: R`What is the horizontal asymptote of $\dfrac{3x + 1}{x^2 + 4}$?`, choices: [R`$y = 0$`, R`$y = 3$`, R`$y = \tfrac{1}{4}$`, R`None`], answer: 0, why: R`The top has lower degree than the bottom.` },
        { q: R`How does $f(x) = (x-1)^2(x+3)$ behave at $x = 1$?`, choices: [R`Touches the $x$-axis and turns`, R`Crosses the $x$-axis`, R`Has a vertical asymptote`, R`Has a hole`], answer: 0, why: R`Multiplicity 2 is even.` },
      ],
    },

    /* ------------------------------------------------------------------ 9 */
    {
      id: 'exp-log', part: 'functions', minutes: 25,
      title: 'Exponential and logarithmic functions',
      summary: 'Model growth and decay, and use logarithms to solve for an unknown exponent.',
      body: R`
        <h3>Exponential functions</h3>
        <p>$f(x) = b^x$ with $b > 0$, $b \ne 1$. If $b > 1$ it grows; if $0 < b < 1$ it decays. Every one passes through $(0, 1)$ and has the horizontal asymptote $y = 0$.</p>
        <p>The natural base $e \approx 2.71828$ shows up in continuous growth:</p>
        <div class="rules">
          <div>$A = P\left(1 + \dfrac{r}{n}\right)^{nt}$<span>Interest compounded $n$ times per year</span></div>
          <div>$A = Pe^{rt}$<span>Interest compounded continuously</span></div>
        </div>

        <h3>Logarithms are exponents</h3>
        <p>$$\log_b x = y \iff b^y = x$$</p>
        <p>"$\log_2 8$" asks "2 to what power is 8?" The answer is 3. $\ln x$ means $\log_e x$, and $\log x$ means $\log_{10} x$.</p>
        <p>$y = \log_b x$ is the inverse of $y = b^x$, so its graph is the reflection over $y = x$: it passes through $(1, 0)$, has a vertical asymptote at $x = 0$, and is defined only for $x > 0$.</p>

        <h3>Log properties</h3>
        <div class="rules">
          <div>$\log_b(MN) = \log_b M + \log_b N$<span>Product becomes a sum</span></div>
          <div>$\log_b\!\left(\dfrac{M}{N}\right) = \log_b M - \log_b N$<span>Quotient becomes a difference</span></div>
          <div>$\log_b(M^p) = p\log_b M$<span>Exponent comes down front</span></div>
          <div>$\log_b x = \dfrac{\ln x}{\ln b}$<span>Change of base (for your calculator)</span></div>
        </div>
        <p class="tip">To solve for a variable in an exponent, take the log of both sides. To solve a log equation, combine into one log and rewrite in exponential form. Always check log answers in the original equation.</p>
      `,
      interactive: { type: 'explog' },
      examples: [
        {
          title: 'Variable in the exponent',
          problem: R`Solve $3^{2x - 1} = 20$.`,
          steps: [
            R`Take $\ln$ of both sides: $(2x - 1)\ln 3 = \ln 20$.`,
            R`Divide: $2x - 1 = \dfrac{\ln 20}{\ln 3} \approx 2.7268$.`,
            R`Solve: $x \approx \dfrac{3.7268}{2} \approx 1.863$.`,
          ],
        },
        {
          title: 'Log equation with a check',
          problem: R`Solve $\log_2 x + \log_2(x - 2) = 3$.`,
          steps: [
            R`Combine: $\log_2\big(x(x-2)\big) = 3$.`,
            R`Exponential form: $x(x - 2) = 2^3 = 8$.`,
            R`$x^2 - 2x - 8 = 0 \Rightarrow (x-4)(x+2) = 0$, so $x = 4$ or $x = -2$.`,
            R`Check: $\log_2(-2)$ is undefined, so reject $-2$. Answer: $x = 4$.`,
          ],
        },
      ],
      takeaways: [
        R`$\log_b x = y \iff b^y = x$.`,
        R`Product $\to$ sum, quotient $\to$ difference, power $\to$ coefficient.`,
        R`Continuous growth: $A = Pe^{rt}$. Check log solutions for negative arguments.`,
      ],
      quiz: [
        { q: R`Evaluate $\log_3 81$.`, choices: [R`$4$`, R`$3$`, R`$27$`, R`$9$`], answer: 0, why: R`$3^4 = 81$.` },
        { q: R`Expand $\ln\!\left(\dfrac{x^2}{y}\right)$.`, choices: [R`$2\ln x - \ln y$`, R`$\dfrac{2\ln x}{\ln y}$`, R`$\ln 2x - \ln y$`, R`$2\ln(x - y)$`], answer: 0, why: R`Quotient rule, then the power rule on $x^2$.` },
        { q: R`Solve $e^x = 7$.`, choices: [R`$x = \ln 7$`, R`$x = 7/e$`, R`$x = \log 7$`, R`$x = e^7$`], answer: 0, why: R`Take $\ln$ of both sides: $x = \ln 7 \approx 1.946$.` },
      ],
    },

    /* ------------------------------------------------------------------ 10 */
    {
      id: 'angles', part: 'trig', minutes: 15,
      title: 'Angles and radian measure',
      summary: 'Convert between degrees and radians and use radians to measure arcs and sectors.',
      body: R`
        <h3>What a radian is</h3>
        <p>One radian is the angle that cuts off an arc equal in length to the radius. A full circle has circumference $2\pi r$, so a full turn is $2\pi$ radians.</p>
        <p>$$\pi \text{ rad} = 180^\circ$$</p>
        <div class="rules">
          <div>$\text{degrees} \times \dfrac{\pi}{180}$<span>Degrees to radians</span></div>
          <div>$\text{radians} \times \dfrac{180}{\pi}$<span>Radians to degrees</span></div>
        </div>

        <h3>Arcs and sectors</h3>
        <p>With $\theta$ in <strong>radians</strong>:</p>
        <div class="rules">
          <div>$s = r\theta$<span>Arc length</span></div>
          <div>$A = \tfrac{1}{2}r^2\theta$<span>Sector area</span></div>
        </div>

        <h3>Standard position, coterminal and reference angles</h3>
        <p>An angle in standard position starts on the positive $x$-axis; positive angles turn counterclockwise.</p>
        <p><strong>Coterminal angles</strong> end in the same place: add or subtract $360^\circ$ (or $2\pi$).</p>
        <p>The <strong>reference angle</strong> is the acute angle between the terminal side and the $x$-axis. Quadrant II: $180^\circ - \theta$. Quadrant III: $\theta - 180^\circ$. Quadrant IV: $360^\circ - \theta$.</p>
      `,
      examples: [
        {
          title: 'Convert and find arc length',
          problem: R`Convert $150^\circ$ to radians, then find the arc length on a circle of radius 4.`,
          steps: [
            R`$150 \cdot \dfrac{\pi}{180} = \dfrac{5\pi}{6}$.`,
            R`Arc length: $s = r\theta = 4 \cdot \dfrac{5\pi}{6} = \dfrac{10\pi}{3} \approx 10.47$.`,
          ],
        },
        {
          title: 'Reference angle in radians',
          problem: R`Find the reference angle of $\dfrac{7\pi}{6}$.`,
          steps: [
            R`$\dfrac{7\pi}{6}$ is a bit more than $\pi$, so it is in Quadrant III.`,
            R`Reference angle: $\dfrac{7\pi}{6} - \pi = \dfrac{\pi}{6}$.`,
          ],
        },
      ],
      takeaways: [
        R`$\pi$ rad $= 180^\circ$.`,
        R`Arc $s = r\theta$, sector $A = \tfrac12 r^2\theta$, with $\theta$ in radians.`,
        R`Coterminal: $\pm 360^\circ$. Reference angle: acute angle to the $x$-axis.`,
      ],
      quiz: [
        { q: R`Convert $\dfrac{7\pi}{4}$ to degrees.`, choices: [R`$315^\circ$`, R`$225^\circ$`, R`$135^\circ$`, R`$405^\circ$`], answer: 0, why: R`$\dfrac{7\pi}{4}\cdot\dfrac{180}{\pi} = 315^\circ$.` },
        { q: R`Which angle is coterminal with $400^\circ$?`, choices: [R`$40^\circ$`, R`$140^\circ$`, R`$-40^\circ$`, R`$760^\circ$`], answer: 0, why: R`$400^\circ - 360^\circ = 40^\circ$.` },
        { q: R`What is the reference angle of $210^\circ$?`, choices: [R`$30^\circ$`, R`$60^\circ$`, R`$150^\circ$`, R`$210^\circ$`], answer: 0, why: R`Quadrant III: $210^\circ - 180^\circ = 30^\circ$.` },
      ],
    },

    /* ------------------------------------------------------------------ 11 */
    {
      id: 'unit-circle', part: 'trig', minutes: 20,
      title: 'The unit circle',
      summary: 'Read exact sine, cosine, and tangent values for any special angle straight off one circle.',
      body: R`
        <h3>The definition</h3>
        <p>Draw a circle of radius 1 centered at the origin. Turn an angle $\theta$ from the positive $x$-axis. The point where it lands is</p>
        <p>$$(\cos\theta,\ \sin\theta)$$</p>
        <p><span class="c-cos">Cosine is the $x$-coordinate</span>; <span class="c-sin">sine is the $y$-coordinate</span>. Then $\tan\theta = \dfrac{\sin\theta}{\cos\theta}$, undefined where $\cos\theta = 0$.</p>

        <h3>Three angles to memorize</h3>
        <p>Every special value comes from these first-quadrant points. The rest of the circle is the same numbers with signs changed.</p>
        <div class="rules">
          <div>$30^\circ = \tfrac{\pi}{6}$<span>$\left(\tfrac{\sqrt3}{2},\ \tfrac12\right)$</span></div>
          <div>$45^\circ = \tfrac{\pi}{4}$<span>$\left(\tfrac{\sqrt2}{2},\ \tfrac{\sqrt2}{2}\right)$</span></div>
          <div>$60^\circ = \tfrac{\pi}{3}$<span>$\left(\tfrac12,\ \tfrac{\sqrt3}{2}\right)$</span></div>
        </div>

        <h3>Signs by quadrant</h3>
        <p>Which functions are positive: <strong>A</strong>ll in Quadrant I, <strong>S</strong>ine in II, <strong>T</strong>angent in III, <strong>C</strong>osine in IV. ("All Students Take Calculus.")</p>
        <p>To evaluate any special angle: find its reference angle, take the first-quadrant value, then attach the sign for its quadrant.</p>

        <h3>Reciprocal functions</h3>
        <p>$\csc\theta = \dfrac{1}{\sin\theta}$, $\ \sec\theta = \dfrac{1}{\cos\theta}$, $\ \cot\theta = \dfrac{\cos\theta}{\sin\theta}$.</p>
        <p>Drag the point around the circle below. It snaps to special angles and shows their exact values.</p>
      `,
      interactive: { type: 'unitcircle' },
      examples: [
        {
          title: 'Use reference angle and sign',
          problem: R`Find the exact value of $\cos\dfrac{5\pi}{4}$.`,
          steps: [
            R`$\dfrac{5\pi}{4}$ is in Quadrant III. Reference angle: $\dfrac{\pi}{4}$.`,
            R`$\cos\dfrac{\pi}{4} = \dfrac{\sqrt2}{2}$.`,
            R`Cosine is negative in Quadrant III: $\cos\dfrac{5\pi}{4} = -\dfrac{\sqrt2}{2}$.`,
          ],
        },
      ],
      takeaways: [
        R`Point on the unit circle: $(\cos\theta, \sin\theta)$.`,
        R`Memorize $\tfrac{\pi}{6}, \tfrac{\pi}{4}, \tfrac{\pi}{3}$; get the rest with reference angles and signs.`,
        R`Positive: All (I), Sine (II), Tangent (III), Cosine (IV).`,
      ],
      quiz: [
        { q: R`What is $\sin\dfrac{5\pi}{6}$?`, choices: [R`$\tfrac12$`, R`$-\tfrac12$`, R`$\tfrac{\sqrt3}{2}$`, R`$-\tfrac{\sqrt3}{2}$`], answer: 0, why: R`Reference angle $\tfrac{\pi}{6}$; sine is positive in Quadrant II.` },
        { q: R`What is $\cos\dfrac{4\pi}{3}$?`, choices: [R`$-\tfrac12$`, R`$\tfrac12$`, R`$-\tfrac{\sqrt3}{2}$`, R`$\tfrac{\sqrt3}{2}$`], answer: 0, why: R`Reference angle $\tfrac{\pi}{3}$; cosine is negative in Quadrant III.` },
        { q: R`What is $\tan\dfrac{3\pi}{4}$?`, choices: [R`$-1$`, R`$1$`, R`$0$`, R`Undefined`], answer: 0, why: R`$\dfrac{\sqrt2/2}{-\sqrt2/2} = -1$.` },
      ],
    },

    /* ------------------------------------------------------------------ 12 */
    {
      id: 'trig-graphs', part: 'trig', minutes: 20,
      title: 'Graphs of sine and cosine',
      summary: 'Read amplitude, period, phase shift, and midline from an equation, then sketch the wave.',
      body: R`
        <h3>The standard form</h3>
        <p>$$y = A\sin\big(B(x - C)\big) + D \qquad y = A\cos\big(B(x - C)\big) + D$$</p>
        <div class="rules">
          <div>Amplitude $= |A|$<span>Half the height from peak to trough</span></div>
          <div>Period $= \dfrac{2\pi}{|B|}$<span>Length of one full cycle</span></div>
          <div>Phase shift $= C$<span>Right if $C > 0$</span></div>
          <div>Midline $y = D$<span>The center line; range is $[D - |A|,\ D + |A|]$</span></div>
        </div>
        <p class="warn">Factor $B$ out before reading the shift. In $\sin(2x - \pi)$, the shift is $\tfrac{\pi}{2}$, not $\pi$, because $2x - \pi = 2\left(x - \tfrac{\pi}{2}\right)$.</p>

        <h3>Sketching one cycle</h3>
        <p>Split one period into four equal parts. Sine starts at the midline going up; cosine starts at a peak. Plot the five key points (midline, peak, midline, trough, midline for sine) and connect them smoothly.</p>
        <p>Tangent is different: period $\pi$, no amplitude, and vertical asymptotes wherever $\cos x = 0$.</p>
      `,
      interactive: { type: 'trig' },
      examples: [
        {
          title: 'Read every feature',
          problem: R`Find the amplitude, period, phase shift, midline, and range of $y = 3\sin(2x - \tfrac{\pi}{2}) + 1$.`,
          steps: [
            R`Factor out $B$: $3\sin\!\left(2\left(x - \tfrac{\pi}{4}\right)\right) + 1$.`,
            R`Amplitude $3$. Period $\dfrac{2\pi}{2} = \pi$.`,
            R`Phase shift $\tfrac{\pi}{4}$ to the right. Midline $y = 1$.`,
            R`Range: $[1 - 3,\ 1 + 3] = [-2, 4]$.`,
          ],
        },
      ],
      takeaways: [
        R`Amplitude $|A|$, period $2\pi/|B|$, shift $C$, midline $D$.`,
        R`Factor $B$ out of the argument before reading the shift.`,
        R`Tangent has period $\pi$ and asymptotes where $\cos x = 0$.`,
      ],
      quiz: [
        { q: R`What is the period of $y = \cos(4x)$?`, choices: [R`$\tfrac{\pi}{2}$`, R`$4\pi$`, R`$8\pi$`, R`$\tfrac{\pi}{4}$`], answer: 0, why: R`$\dfrac{2\pi}{4} = \dfrac{\pi}{2}$.` },
        { q: R`What is the amplitude of $y = -5\sin x$?`, choices: [R`$5$`, R`$-5$`, R`$10$`, R`$\tfrac{2\pi}{5}$`], answer: 0, why: R`Amplitude is $|A| = 5$; the negative only flips the graph.` },
        { q: R`What is the range of $y = 2\cos x - 1$?`, choices: [R`$[-3, 1]$`, R`$[-2, 2]$`, R`$[-1, 1]$`, R`$[-1, 3]$`], answer: 0, why: R`Midline $-1$, amplitude $2$: from $-3$ to $1$.` },
      ],
    },

    /* ------------------------------------------------------------------ 13 */
    {
      id: 'identities', part: 'trig', minutes: 20,
      title: 'Trigonometric identities',
      summary: 'Rewrite trig expressions into simpler or more useful forms with a core set of identities.',
      body: R`
        <h3>The core identities</h3>
        <div class="rules">
          <div>$\sin^2\theta + \cos^2\theta = 1$<span>Pythagorean (comes straight from the unit circle)</span></div>
          <div>$1 + \tan^2\theta = \sec^2\theta$<span>Divide the first by $\cos^2\theta$</span></div>
          <div>$1 + \cot^2\theta = \csc^2\theta$<span>Divide the first by $\sin^2\theta$</span></div>
          <div>$\sin(-\theta) = -\sin\theta,\ \cos(-\theta) = \cos\theta$<span>Sine is odd, cosine is even</span></div>
        </div>

        <h3>Sum, difference, and double angle</h3>
        <div class="rules">
          <div>$\sin(\alpha \pm \beta) = \sin\alpha\cos\beta \pm \cos\alpha\sin\beta$<span>Signs match</span></div>
          <div>$\cos(\alpha \pm \beta) = \cos\alpha\cos\beta \mp \sin\alpha\sin\beta$<span>Signs flip</span></div>
          <div>$\sin 2\theta = 2\sin\theta\cos\theta$<span>Double angle for sine</span></div>
          <div>$\cos 2\theta = \cos^2\theta - \sin^2\theta = 1 - 2\sin^2\theta = 2\cos^2\theta - 1$<span>Three forms; pick the one that helps</span></div>
        </div>

        <h3>How to verify an identity</h3>
        <ol class="checklist">
          <li>Work on the more complicated side only.</li>
          <li>Rewrite everything in sines and cosines.</li>
          <li>Look for a Pythagorean identity, a common denominator, or something to factor.</li>
          <li>Stop when the side matches the other side exactly.</li>
        </ol>
      `,
      examples: [
        {
          title: 'Verify an identity',
          problem: R`Verify $\dfrac{1 - \cos^2 x}{\sin x} = \sin x$.`,
          steps: [
            R`Work on the left side.`,
            R`Pythagorean identity: $1 - \cos^2 x = \sin^2 x$.`,
            R`$\dfrac{\sin^2 x}{\sin x} = \sin x$, which matches the right side.`,
          ],
        },
        {
          title: 'Exact value with a difference formula',
          problem: R`Find the exact value of $\cos 15^\circ$.`,
          steps: [
            R`Write $15^\circ = 45^\circ - 30^\circ$.`,
            R`$\cos(45^\circ - 30^\circ) = \cos45^\circ\cos30^\circ + \sin45^\circ\sin30^\circ$.`,
            R`$= \dfrac{\sqrt2}{2}\cdot\dfrac{\sqrt3}{2} + \dfrac{\sqrt2}{2}\cdot\dfrac12 = \dfrac{\sqrt6 + \sqrt2}{4}$.`,
          ],
        },
      ],
      takeaways: [
        R`$\sin^2\theta + \cos^2\theta = 1$ and its two cousins.`,
        R`$\sin 2\theta = 2\sin\theta\cos\theta$; $\cos 2\theta$ has three forms.`,
        R`To verify: convert to sine and cosine, work one side only.`,
      ],
      quiz: [
        { q: R`Which identity is true?`, choices: [R`$1 + \tan^2\theta = \sec^2\theta$`, R`$1 + \sec^2\theta = \tan^2\theta$`, R`$\tan^2\theta - 1 = \sec^2\theta$`, R`$1 + \tan^2\theta = \csc^2\theta$`], answer: 0, why: R`Divide $\sin^2\theta + \cos^2\theta = 1$ by $\cos^2\theta$.` },
        { q: R`$\sin 2x$ equals:`, choices: [R`$2\sin x\cos x$`, R`$2\sin x$`, R`$\sin^2 x - \cos^2 x$`, R`$\sin x + \cos x$`], answer: 0, why: R`This is the double-angle identity for sine.` },
        { q: R`Simplify $\cos^2 x - \sin^2 x$.`, choices: [R`$\cos 2x$`, R`$1$`, R`$\sin 2x$`, R`$-1$`], answer: 0, why: R`This is one form of the double-angle identity for cosine.` },
      ],
    },

    /* ------------------------------------------------------------------ 14 */
    {
      id: 'trig-equations', part: 'trig', minutes: 20,
      title: 'Solving trigonometric equations',
      summary: 'Find every angle that makes a trig equation true, on an interval or in general.',
      body: R`
        <h3>The process</h3>
        <ol class="checklist">
          <li>Isolate the trig function (or factor so each factor has one trig function).</li>
          <li>Find the reference angle from the absolute value.</li>
          <li>Use the sign to pick the quadrants and list the angles in $[0, 2\pi)$.</li>
          <li>If asked for all solutions, add $2\pi k$ (or $\pi k$ for tangent), where $k$ is any integer.</li>
        </ol>
        <p class="warn">Do not divide both sides by a trig function like $\cos x$. You can lose the solutions where it equals zero. Move everything to one side and factor instead.</p>

        <h3>Multiple angles</h3>
        <p>For an equation like $\sin 2x = 0$ on $[0, 2\pi)$, let $u = 2x$. Then $u$ runs over $[0, 4\pi)$, which is two full trips around the circle, so expect twice as many solutions. Solve for $u$, then divide by 2.</p>
      `,
      examples: [
        {
          title: 'Linear in sine',
          problem: R`Solve $2\sin x - 1 = 0$ on $[0, 2\pi)$.`,
          steps: [
            R`Isolate: $\sin x = \tfrac12$.`,
            R`Reference angle: $\tfrac{\pi}{6}$.`,
            R`Sine is positive in Quadrants I and II: $x = \tfrac{\pi}{6},\ \tfrac{5\pi}{6}$.`,
          ],
        },
        {
          title: 'Quadratic in cosine',
          problem: R`Solve $2\cos^2 x - \cos x - 1 = 0$ on $[0, 2\pi)$.`,
          steps: [
            R`Factor like $2u^2 - u - 1$: $(2\cos x + 1)(\cos x - 1) = 0$.`,
            R`$\cos x = -\tfrac12$: Quadrants II and III with reference $\tfrac{\pi}{3}$, so $x = \tfrac{2\pi}{3},\ \tfrac{4\pi}{3}$.`,
            R`$\cos x = 1$: $x = 0$.`,
            R`Solutions: $0,\ \tfrac{2\pi}{3},\ \tfrac{4\pi}{3}$.`,
          ],
        },
        {
          title: 'Use an identity, then factor',
          problem: R`Solve $\sin 2x = \cos x$ on $[0, 2\pi)$.`,
          steps: [
            R`Double angle: $2\sin x\cos x = \cos x$.`,
            R`Move everything to one side and factor (do not divide by $\cos x$): $\cos x(2\sin x - 1) = 0$.`,
            R`$\cos x = 0$: $x = \tfrac{\pi}{2},\ \tfrac{3\pi}{2}$.`,
            R`$\sin x = \tfrac12$: $x = \tfrac{\pi}{6},\ \tfrac{5\pi}{6}$.`,
          ],
        },
      ],
      takeaways: [
        R`Isolate, find the reference angle, use the sign to choose quadrants.`,
        R`Factor instead of dividing by a trig function.`,
        R`All solutions: add $2\pi k$ (sine, cosine) or $\pi k$ (tangent).`,
      ],
      quiz: [
        { q: R`Solve $\tan x = \sqrt3$ on $[0, 2\pi)$.`, choices: [R`$\tfrac{\pi}{3},\ \tfrac{4\pi}{3}$`, R`$\tfrac{\pi}{3},\ \tfrac{2\pi}{3}$`, R`$\tfrac{\pi}{6},\ \tfrac{7\pi}{6}$`, R`$\tfrac{\pi}{3}$ only`], answer: 0, why: R`Reference $\tfrac{\pi}{3}$; tangent is positive in Quadrants I and III.` },
        { q: R`Solve $\cos x = 0$ on $[0, 2\pi)$.`, choices: [R`$\tfrac{\pi}{2},\ \tfrac{3\pi}{2}$`, R`$0,\ \pi$`, R`$\tfrac{\pi}{2}$ only`, R`$\pi$ only`], answer: 0, why: R`Cosine is the $x$-coordinate; it is $0$ at the top and bottom of the circle.` },
        { q: R`How many solutions does $\sin 2x = 0$ have on $[0, 2\pi)$?`, choices: [R`$4$`, R`$2$`, R`$3$`, R`$1$`], answer: 0, why: R`$x = 0,\ \tfrac{\pi}{2},\ \pi,\ \tfrac{3\pi}{2}$.` },
      ],
    },

    /* ------------------------------------------------------------------ 15 */
    {
      id: 'triangles', part: 'trig', minutes: 20,
      title: 'Solving triangles',
      summary: 'Find missing sides and angles in right and oblique triangles.',
      body: R`
        <h3>Right triangles</h3>
        <p>For an acute angle $\theta$ in a right triangle: <strong>SOH-CAH-TOA</strong>.</p>
        <div class="rules">
          <div>$\sin\theta = \dfrac{\text{opposite}}{\text{hypotenuse}}$<span>SOH</span></div>
          <div>$\cos\theta = \dfrac{\text{adjacent}}{\text{hypotenuse}}$<span>CAH</span></div>
          <div>$\tan\theta = \dfrac{\text{opposite}}{\text{adjacent}}$<span>TOA</span></div>
        </div>

        <h3>Any triangle</h3>
        <p>Label angles $A, B, C$ and the sides opposite them $a, b, c$.</p>
        <div class="rules">
          <div>$\dfrac{a}{\sin A} = \dfrac{b}{\sin B} = \dfrac{c}{\sin C}$<span>Law of Sines: use when you know an angle and its opposite side (AAS, ASA, SSA)</span></div>
          <div>$c^2 = a^2 + b^2 - 2ab\cos C$<span>Law of Cosines: use for SAS or SSS</span></div>
          <div>$\text{Area} = \tfrac12 ab\sin C$<span>Two sides and the angle between them</span></div>
        </div>
        <p class="warn">SSA is the <em>ambiguous case</em>: the given information can produce zero, one, or two triangles. If $\sin B$ comes out greater than 1, there is no triangle. If it is less than 1, also test the obtuse angle $180^\circ - B$.</p>
      `,
      examples: [
        {
          title: 'Law of Cosines (SAS)',
          problem: R`In a triangle, $a = 7$, $b = 9$, and $C = 60^\circ$. Find $c$.`,
          steps: [
            R`$c^2 = 7^2 + 9^2 - 2(7)(9)\cos 60^\circ$.`,
            R`$= 49 + 81 - 126 \cdot \tfrac12 = 130 - 63 = 67$.`,
            R`$c = \sqrt{67} \approx 8.19$.`,
          ],
        },
        {
          title: 'Law of Sines (AAS)',
          problem: R`$A = 40^\circ$, $B = 60^\circ$, $a = 10$. Find $b$.`,
          steps: [
            R`Set up: $\dfrac{b}{\sin 60^\circ} = \dfrac{10}{\sin 40^\circ}$.`,
            R`$b = \dfrac{10 \sin 60^\circ}{\sin 40^\circ} \approx \dfrac{10(0.8660)}{0.6428}$.`,
            R`$b \approx 13.47$.`,
          ],
        },
      ],
      takeaways: [
        R`Right triangles: SOH-CAH-TOA.`,
        R`Law of Sines for an angle-side pair; Law of Cosines for SAS or SSS.`,
        R`Area $= \tfrac12 ab\sin C$. Watch for two triangles in SSA.`,
      ],
      quiz: [
        { q: R`In a right triangle, the side opposite $\theta$ is 5 and the hypotenuse is 13. What is $\cos\theta$?`, choices: [R`$\tfrac{12}{13}$`, R`$\tfrac{5}{13}$`, R`$\tfrac{5}{12}$`, R`$\tfrac{13}{12}$`], answer: 0, why: R`Adjacent $= \sqrt{169 - 25} = 12$, so $\cos\theta = \tfrac{12}{13}$.` },
        { q: R`Find the area of a triangle with $a = 6$, $b = 8$, $C = 30^\circ$.`, choices: [R`$12$`, R`$24$`, R`$48$`, R`$12\sqrt3$`], answer: 0, why: R`$\tfrac12(6)(8)\sin 30^\circ = 24 \cdot \tfrac12 = 12$.` },
        { q: R`You know two sides and the angle between them. Which tool finds the third side?`, choices: [R`Law of Cosines`, R`Law of Sines`, R`SOH-CAH-TOA`, R`Pythagorean identity`], answer: 0, why: R`SAS has no known angle-side pair, so the Law of Sines cannot start; use the Law of Cosines.` },
      ],
    },
  ];

  lessons.forEach((l, i) => { l.number = i + 1; });
  window.COURSE = { parts, lessons };
})();
