import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';
import { MemoryService } from '../services/memory.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
})
export class GameComponent implements OnInit {
  flags: any[] = [];
  pairs: number = 2;
  cards: any[] = [];
  firstCard: any = null;
  secondCard: any = null;
  lockBoard: boolean = false;
  pairsFound: number = 0;
  tries: number = 0;
  score: number = Number(localStorage.getItem('score')) || 0;
  moves: number = 0;
  misses: number = 0;
  roundsPlayed: number = Number(localStorage.getItem('roundsPlayed')) || 0;
  level: number = Number(localStorage.getItem('level')) || 1;
  accuracy: number = 0;
  showPopup: boolean = false;
  levelUpOccurred: boolean = false;
  timer: number = 60;
  interval: any;
  maxPairs: number = 500; // Allow up to 500 pairs
  customGameMode: boolean = false;
  showPairSelection: boolean = false; // Track whether to show pair selection popup

  constructor(
    private router: Router,
    private memoryService: MemoryService,
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.logEvent('Game Page', 'visita');
      this.pairs = this.calculatePairsForLevel();
      this.startGame();
    }
  }

  calculatePairsForLevel(): number {
    const basePairs = 2;
    const pairsIncreaseRate = Math.ceil(this.level / 5);
    return Math.min(basePairs + pairsIncreaseRate, this.maxPairs);
  }

  async startGame(customPairs: number | null = null) {
    clearInterval(this.interval);
    this.flags = [];
    this.pairsFound = 0;
    this.tries = 0;
    this.moves = 0;
    this.misses = 0;
    this.accuracy = 0;
    this.showPopup = false;
    this.levelUpOccurred = false;
    this.showPairSelection = false;

    this.pairs = customPairs || this.calculatePairsForLevel();

    if (this.pairs >= this.maxPairs) {
      this.showPairSelection = true;
    }

    const usedCountries: Set<string> = new Set();

    while (this.flags.length < this.pairs) {
      const randomId = this.getRandomId();
      const flag = await this.memoryService.getFlag(randomId).toPromise();

      if (flag && !usedCountries.has(flag.country)) {
        this.flags.push(flag);
        usedCountries.add(flag.country);
      }
    }

    const doubledFlags = [...this.flags, ...this.flags];
    this.cards = this.shuffle(
      doubledFlags.map((flag) => ({
        ...flag,
        flipped: false,
        matched: false,
      }))
    );

    this.moves = 0;
    this.pairsFound = 0;
    this.startTimer();
  }

  startTimer() {
    const timePerPair = 9;
    this.timer = this.pairs * timePerPair;

    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  getRandomId(): number {
    return Math.floor(Math.random() * 249) + 1;
  }

  shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  flipCard(card: any) {
    if (this.lockBoard || card.flipped) return;

    this.logEvent('Flip Card', 'click');

    card.flipped = true;

    if (!this.firstCard) {
      this.firstCard = card;
      return;
    }

    this.secondCard = card;
    this.moves++;
    this.tries++;

    this.checkMatch();
  }

  checkMatch() {
    if (this.firstCard.name === this.secondCard.name) {
      this.markAsMatched();
      this.pairsFound++;
      this.score += this.level;
      this.calculateAccuracy();
      if (this.pairsFound === this.pairs) {
        clearInterval(this.interval);
        this.logEvent('Game Completed', 'click');
        this.showPopup = true;
        this.roundsPlayed++;
        localStorage.setItem('roundsPlayed', this.roundsPlayed.toString());
        this.updateProgress();
        this.checkLevelUp();
      }
    } else {
      this.unflipCards();
      this.misses++;
      this.score -= Math.ceil(this.level / 2);
    }
  }

  markAsMatched() {
    this.firstCard.matched = true;
    this.secondCard.matched = true;
    this.resetBoard();
  }

  unflipCards() {
    this.lockBoard = true;
    setTimeout(() => {
      this.firstCard.flipped = false;
      this.secondCard.flipped = false;
      this.resetBoard();
    }, 1000);
  }

  resetBoard() {
    this.firstCard = null;
    this.secondCard = null;
    this.lockBoard = false;
  }

  calculateAccuracy() {
    this.accuracy = this.moves === 0 ? 0 : (this.pairsFound / this.moves) * 100;
  }

  restartGame(customPairs: number | null = null) {
    this.customGameMode = !!customPairs;
    this.showPopup = false;
    this.logEvent('Restart Game', 'click');
    this.startGame(customPairs);
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.logEvent('Logout', 'click');
    this.router.navigate(['/login']);
  }

  checkLevelUp() {
    const pointsNeeded = this.calculatePointsNeeded();
    if (this.score >= pointsNeeded && !this.levelUpOccurred) {
      this.level++;
      this.score -= pointsNeeded;
      localStorage.setItem('level', this.level.toString());
      this.updateProgress();
      this.levelUpOccurred = true;
    }
  }

  updateProgress() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const data = {
      token: token,
      scoreIncrement: this.score,
      gamesPlayedIncrement: 1,
      levelIncrement: this.level,
    };

    this.http.post('http://localhost:3000/api/auth/update', data).subscribe();
  }

  calculatePointsNeeded(): number {
    return 2 + (this.level - 1) * 5;
  }

  calculateLevelProgress(): number {
    const pointsNeeded = this.calculatePointsNeeded();
    return Math.min((this.score / pointsNeeded) * 100, 100);
  }

  selectPairs(pairs: number) {
    this.showPairSelection = false;
    this.startGame(pairs);
  }

  private logEvent(location: string, eventType: string): void {
    const sessionId = this.sessionService.getSessionId();
    this.http
      .post('http://localhost:3000/api/statistics', {
        sessionId,
        llocEvent: location,
        tipusEvent: eventType,
        createdAt: new Date(),
      })
      .subscribe({
        next: () => console.log(`Event logged: ${location} (${eventType})`),
        error: (err) => console.error('Error logging event:', err),
      });
  }
}
