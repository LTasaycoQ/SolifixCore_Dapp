import { TestBed } from '@angular/core/testing';

import { TransactionContractService } from './transaction-contract.service';

describe('TransactionContractService', () => {
  let service: TransactionContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
