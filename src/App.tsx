import { useRef } from "react";
import styled from "styled-components";
import { useState } from "react";

function App() {
    const [targetNumber, setTargetNumber] = useState<number[]>([]);
    const [guessNumber, setGuessNumber] = useState<string>("");
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [gaming, setGaming] = useState<boolean>(false);
    const resultDivRef = useRef<HTMLDivElement>(null);
    const [gameTimeLine, setGameTimeLine] = useState<
        {
            gameNumber: number;
            startTime: string;
            endTime: string | null;
            attempts: number;
        }[]
    >([]);

    const addResultMessage = (message: string) => {
        const resultDiv = resultDivRef.current;
        const newParagraph = document.createElement("p");
        newParagraph.textContent = message;
        resultDiv?.appendChild(newParagraph);

        scrollToBottom();
    };

    const scrollToBottom = () => {
        resultDivRef.current?.scrollTo({
            top: resultDivRef.current.scrollHeight,
            behavior: "smooth",
        });
    };

    const startGame = () => {
        const generatedNumber: number[] = [];
        while (generatedNumber.length < 3) {
            const randomNum = Math.floor(Math.random() * 10);
            if (!generatedNumber.includes(randomNum)) {
                generatedNumber.push(randomNum);
            }
        }
        const newGameNumber = gameTimeLine.length + 1;
        const startTime = new Date().toLocaleString();
        setGameTimeLine((prev) => [
            ...prev,
            {
                gameNumber: newGameNumber,
                startTime,
                endTime: null,
                attempts: 0,
            },
        ]);
        setTargetNumber(generatedNumber);
        setGameOver(false);
        setGaming(true);
        addResultMessage("컴퓨터가 숫자를 뽑았습니다.");
        console.log(targetNumber);
    };

    const endGame = () => {
        setTargetNumber([]);
        setGuessNumber("");
        setGameOver(true);
        addResultMessage("애플리케이션이 종료되었습니다.");
    };

    const calculateBallAndStrike = (userNumber: string) => {
        let newBalls = 0;
        let newStrikes = 0;

        userNumber.split("").forEach((num, index) => {
            const guessDigit = parseInt(num);
            if (targetNumber[index] === guessDigit) {
                newStrikes++;
            } else if (targetNumber.includes(guessDigit)) {
                newBalls++;
            }
        });
        setGameTimeLine((prev) => {
            const updatedTimes = [...prev];
            const lastGame = updatedTimes[updatedTimes.length - 1];
            if (lastGame) {
                console.log("지금");
                lastGame.attempts += 1;
            }
            return updatedTimes;
        });

        if (newStrikes === 3) {
            const endTime = new Date().toLocaleString();
            setGameTimeLine((prev) => {
                const updatedTimes = [...prev];
                const lastGame = updatedTimes[updatedTimes.length - 1];
                if (lastGame) {
                    lastGame.endTime = endTime;
                }
                return updatedTimes;
            });
            addResultMessage("3개의 숫자를 모두 맞히셨습니다.");
            addResultMessage("-------게임 종료-------");
            addResultMessage(
                "게임을 새로 시작하려면 1, 기록을 보려면 2, 통계를 보려면 3, 종료하려면 9을 입력하세요."
            );
            setGameOver(true);
            setGaming(false);
        } else {
            const resultText = `${newBalls}볼 ${newStrikes}스트라이크`;
            addResultMessage(resultText);
        }
    };
    const hasUniqueDigits = (input: string) => {
        const digits = input.split("");
        const uniqueDigits = new Set(digits);
        return digits.length === uniqueDigits.size;
    };

    const showGameRecords = () => {
        if (gameTimeLine.length === 0) {
            addResultMessage("게임 기록이 없습니다.");
            return;
        }

        addResultMessage("게임 기록");
        gameTimeLine.forEach((game) => {
            addResultMessage(
                `[${game.gameNumber}] / 시작시간: ${game.startTime} / 종료시간: ${game.endTime} / 횟수: ${game.attempts}`
            );
        });
        addResultMessage("-------기록 종료-------");
        addResultMessage(
            "게임을 새로 시작하려면 1, 기록을 보려면 2, 통계를 보려면 3, 종료하려면 9을 입력하세요."
        );
    };

    const showStatistics = () => {
        const maxAttempts = Math.max(
            ...gameTimeLine.map((game) => game.attempts)
        );
        const maxAttemptsNumber = Math.max(
            ...gameTimeLine.map((game) => game.gameNumber)
        );

        // 가장 적은 시도 횟수로 성공한 게임
        const minAttempts = Math.min(
            ...gameTimeLine.map((game) => game.attempts)
        );
        const minAttemptsNumber = Math.min(
            ...gameTimeLine.map((game) => game.gameNumber)
        );

        // 모든 시도 횟수의 평균
        const totalAttempts = gameTimeLine.reduce(
            (sum, game) => sum + game.attempts,
            0
        );
        const avgAttempts = totalAttempts / gameTimeLine.length;

        if (gameTimeLine.length === 0) {
            addResultMessage("게임 기록이 없습니다.");
            return;
        }

        addResultMessage(
            `가장 적은 횟수: ${minAttempts}회 - [${minAttemptsNumber}]`
        );
        addResultMessage(
            `가장 많은 횟수: ${maxAttempts}회 - [${maxAttemptsNumber}]`
        );
        addResultMessage(`평균횟수: ${avgAttempts}회`);
        addResultMessage("-------통계 종료-------");
        addResultMessage(
            "게임을 새로 시작하려면 1, 기록을 보려면 2, 통계를 보려면 3, 종료하려면 9을 입력하세요."
        );
    };

    const handleSubmit = () => {
        console.log(targetNumber);

        if (guessNumber === "1") {
            if (gaming) {
                alert("숫자 3개를 입력하세요.");
                return;
            }
            startGame();
            return;
        }

        if (guessNumber === "2") {
            if (gaming) {
                alert("숫자 3개를 입력하세요.");
                return;
            }
            showGameRecords();
            return;
        }

        if (guessNumber === "3") {
            if (gaming) {
                alert("숫자 3개를 입력하세요.");
                return;
            }
            showStatistics();
            return;
        }

        if (guessNumber === "9") {
            if (gaming) {
                alert("숫자 3개를 입력하세요.");
                return;
            }
            endGame();
            return;
        }

        if (guessNumber.length !== 3 || isNaN(Number(guessNumber))) {
            alert("숫자 3개를 입력해주세요.");
            return;
        }

        if (!hasUniqueDigits(guessNumber)) {
            alert("각 숫자는 중복되지 않아야 합니다.");
            return;
        }

        if (gameOver) {
            alert(
                "게임이 이미 종료되었습니다. 다시 시작하려면 1을 입력하세요."
            );
            return;
        }

        // 위 조건을 모두 통과한 경우에만 숫자 비교 실행
        calculateBallAndStrike(guessNumber);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGuessNumber(e.target.value);
    };
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <MainWrapper>
            <h1>숫자 야구</h1>
            <Wrapper>
                <InputWrapper
                    type="text"
                    id="guessInput"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    maxLength={3}
                />
                <ButtonWrapper type="submit" onClick={handleSubmit}>
                    제출
                </ButtonWrapper>
            </Wrapper>

            <ResultWrapper className="result" ref={resultDivRef}>
                <p>
                    게임을 새로 시작하려면 1, 기록을 보려면 2, 통계를 보려면 3,
                    종료하려면 9을 입력하세요.
                </p>
            </ResultWrapper>
        </MainWrapper>
    );
}

const InputWrapper = styled.input`
    width: 70%;
    padding: 10px;
`;
const ButtonWrapper = styled.button`
    width: 30%;
`;
const Wrapper = styled.div`
    display: flex;
    width: 600px;
    flex-direction: row;
    gap: 10px;
`;

const MainWrapper = styled.div`
    min-height: 100vh;
    gap: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const ResultWrapper = styled.div`
    text-align: center;
    width: 600px;
    height: 400px;
    background-color: lightgray;
    border-radius: 20px;
    overflow-y: auto;
    padding: 10px;
`;

export default App;
